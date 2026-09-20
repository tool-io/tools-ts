import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  jobShopSchedulingInstanceExample as example,
  calculateJobShopSchedulingInstance,
} from "./tool.js";
const smallInput = {
  jobCount: 1,
  machineCount: 1,
  minimumDuration: 2,
  maximumDuration: 2,
  seed: 42,
} as const;

describe("Random Job-Shop Scheduling Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateJobShopSchedulingInstance(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("independently checks processing, precedence, and machine exclusivity", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        jobCount: 6,
        machineCount: 4,
        minimumDuration: 1,
        maximumDuration: 9,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output;
      expect(out.processingTimes).toHaveLength(6);
      expect(out.schedule).toHaveLength(24);
      for (let job = 0; job < 6; job += 1) {
        expect([...out.machineOrder[job]].sort((a, b) => a - b)).toEqual([
          0, 1, 2, 3,
        ]);

        const operations = out.schedule.filter((op) => op.job === job);
        operations.forEach((op, index) => {
          expect(op.machine).toBe(out.machineOrder[job][index]);
          expect(op.end - op.start).toBe(out.processingTimes[job][index]);
          expect(op.end - op.start).toBeGreaterThanOrEqual(1);
          expect(op.end - op.start).toBeLessThanOrEqual(9);
          expect(op.start).toBeGreaterThanOrEqual(
            index ? operations[index - 1].end : 0,
          );
        });
      }
      for (let machine = 0; machine < 4; machine += 1) {
        const ops = out.schedule
          .filter((op) => op.machine === machine)
          .sort((a, b) => a.start - b.start);
        for (let i = 1; i < ops.length; i += 1)
          expect(ops[i].start).toBeGreaterThanOrEqual(ops[i - 1].end);
      }
      expect(out.makespan).toBe(Math.max(...out.schedule.map((op) => op.end)));
    }
  });
  it("has the known fixed-duration two-machine schedule", () => {
    const result = tool.execute(
      { jobCount: 2, machineCount: 2, minimumDuration: 2, maximumDuration: 2 },
      { random: () => 0.999 },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.schedule).toEqual([
      { job: 0, operation: 0, machine: 0, start: 0, end: 2 },
      { job: 0, operation: 1, machine: 1, start: 2, end: 4 },
      { job: 1, operation: 0, machine: 0, start: 2, end: 4 },
      { job: 1, operation: 1, machine: 1, start: 4, end: 6 },
    ]);
  });
  it("enforces work and exact-time limits", () => {
    expect(
      tool.execute({ ...smallInput, jobCount: 64, machineCount: 16 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "jobCount", code: "resource_limit" }] },
    });
    expect(tool.execute({ ...smallInput, minimumDuration: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumDuration" }] },
    });
    expect(
      tool.execute({
        ...smallInput,
        jobCount: 2,
        minimumDuration: Number.MAX_SAFE_INTEGER,
        maximumDuration: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumDuration", code: "unsafe_schedule_time" }],
      },
    });
  });
});
