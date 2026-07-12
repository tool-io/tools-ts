import { describe, expect, it } from "vitest";

import {
  createToolExecutionControl,
  progressInterval,
  shouldReportProgress,
} from "./execution.js";
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
