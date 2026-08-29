import { describe, expect, it } from "vitest";

import {
  createToolExecutionControl,
  executeToolDefinition,
  progressInterval,
  shouldReportProgress,
} from "./execution.js";
import { bodyMassIndexTool } from "../body-mass-index/tool.js";
import { toolExecutionCancelled } from "./result.js";

describe("portable execution control", () => {
  it("does not report progress when execution is already canceled", () => {
    const progress: unknown[] = [];
    const control = createToolExecutionControl({
      reportProgress: (event) => progress.push(event),
      signal: { aborted: true },
    });

    expect(control.checkpoint({ completed: 0, total: 10 })).toBe(false);
    expect(progress).toEqual([]);
    expect(toolExecutionCancelled()).toEqual({
      error: {
        code: "execution_cancelled",
        issues: [
          {
            code: "execution_cancelled",
            field: "",
            message: "Tool execution was canceled.",
          },
        ],
      },
      ok: false,
    });
  });

  it("reports monotonic progress and carries a declared total forward", () => {
    const progress: unknown[] = [];
    const control = createToolExecutionControl({
      reportProgress: (event) => progress.push(event),
    });

    expect(control.checkpoint({ completed: 0, total: 4 })).toBe(true);
    expect(control.checkpoint({ completed: 2 })).toBe(true);
    expect(control.checkpoint({ completed: 4 })).toBe(true);
    expect(progress).toEqual([
      { completed: 0, total: 4 },
      { completed: 2, total: 4 },
      { completed: 4, total: 4 },
    ]);
  });

  it.each([
    [{ completed: -1 }, "finite nonnegative"],
    [{ completed: 2, total: 1 }, "must not exceed"],
    [{ completed: 0, message: " " }, "must not be empty"],
  ])("rejects invalid progress %#", (progress, message) => {
    const control = createToolExecutionControl();
    expect(() => control.checkpoint(progress)).toThrow(message);
  });

  it("rejects backward progress and changing totals", () => {
    const control = createToolExecutionControl();
    control.checkpoint({ completed: 1, total: 4 });
    expect(() => control.checkpoint({ completed: 0 })).toThrow(
      "must not move backward",
    );
    expect(() => control.checkpoint({ completed: 2, total: 5 })).toThrow(
      "must remain constant",
    );
  });

  it("isolates observer failures from tool execution", () => {
    const control = createToolExecutionControl({
      reportProgress: () => {
        throw new Error("observer failed");
      },
    });
    expect(control.checkpoint({ completed: 1, total: 1 })).toBe(true);
  });

  it("detects cancellation requested by a progress observer", () => {
    const signal = { aborted: false };
    const progress: unknown[] = [];
    const control = createToolExecutionControl({
      reportProgress: (event) => {
        progress.push(event);
        signal.aborted = true;
      },
      signal,
    });

    expect(control.checkpoint({ completed: 1, total: 2 })).toBe(false);
    expect(control.checkpoint({ completed: 2, total: 2 })).toBe(false);
    expect(progress).toHaveLength(1);
  });

  it("limits progress-event frequency while always reporting completion", () => {
    const interval = progressInterval(1_000, 100);
    expect(interval).toBe(10);
    expect(shouldReportProgress(9, 1_000, interval)).toBe(false);
    expect(shouldReportProgress(10, 1_000, interval)).toBe(true);
    expect(shouldReportProgress(1_000, 1_000, interval)).toBe(true);
    expect(() => shouldReportProgress(1_001, 1_000, interval)).toThrow(
      "must not exceed total",
    );
    expect(() => shouldReportProgress(1, 10, 0)).toThrow("must be a positive");
  });
});

describe("asynchronous tool executor", () => {
  it("executes a pure calculation through the asynchronous boundary", async () => {
    await expect(
      executeToolDefinition(bodyMassIndexTool, {
        heightM: 1.8,
        weightKg: 70,
      }),
    ).resolves.toEqual({
      ok: true,
      output: { bmi: 21.604938271604937 },
    });
  });

  it("rejects a missing required capability before calculation", async () => {
    const tool = {
      ...bodyMassIndexTool,
      execution: {
        capabilities: [
          { id: "network/public-ip", required: true, schemaVersion: 1 },
        ],
        kind: "remote" as const,
      },
    };
    await expect(executeToolDefinition(tool, {})).resolves.toMatchObject({
      error: {
        capability: { id: "network/public-ip", schemaVersion: 1 },
        code: "capability_unavailable",
      },
      ok: false,
    });
  });

  it("preflights capabilities and datasets by exact version", async () => {
    const supported: string[] = [];
    const tool = {
      ...bodyMassIndexTool,
      execution: {
        capabilities: [
          { id: "optional/location", required: false, schemaVersion: 1 },
          { id: "network/public-ip", required: true, schemaVersion: 1 },
        ],
        datasets: [{ id: "weather/observations", schemaVersion: 2 }],
        kind: "data" as const,
      },
    };
    const result = await executeToolDefinition(
      tool,
      { heightM: 1.8, weightKg: 70 },
      {
        capabilities: {
          invoke: async () => undefined,
          supports: ({ id, schemaVersion }) => {
            supported.push(`${id}@${schemaVersion}`);
            return id === "network/public-ip" && schemaVersion === 1;
          },
        },
        datasets: {
          read: async () => undefined,
          supports: ({ id, schemaVersion }) => {
            supported.push(`${id}@${schemaVersion}`);
            return id === "weather/observations" && schemaVersion === 2;
          },
        },
      },
    );
    expect(result.ok).toBe(true);
    expect(supported).toEqual([
      "network/public-ip@1",
      "weather/observations@2",
    ]);
  });

  it("normalizes cancellation and unexpected adapter failures", async () => {
    await expect(
      executeToolDefinition(
        bodyMassIndexTool,
        {},
        {
          signal: { aborted: true },
        },
      ),
    ).resolves.toMatchObject({
      error: { code: "execution_cancelled" },
      ok: false,
    });

    const tool = {
      ...bodyMassIndexTool,
      execution: {
        datasets: [{ id: "weather/observations", schemaVersion: 1 }],
        kind: "data" as const,
      },
    };
    await expect(
      executeToolDefinition(
        tool,
        {},
        {
          datasets: {
            read: async () => undefined,
            supports: () => {
              throw new Error("dataset adapter offline");
            },
          },
        },
      ),
    ).resolves.toMatchObject({
      error: {
        code: "execution_failed",
        issues: [{ message: "Tool execution failed: dataset adapter offline" }],
      },
      ok: false,
    });
  });
});
