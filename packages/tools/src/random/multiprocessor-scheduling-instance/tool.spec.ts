import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  multiprocessorSchedulingInstanceExample as example,
  calculateMultiprocessorSchedulingInstance,
} from "./tool.js";
const smallInput = {
  jobCount: 3,
  processorCount: 2,
  minimumDuration: 2,
  maximumDuration: 2,
  seed: 42,
} as const;

describe("Random Multiprocessor Scheduling Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMultiprocessorSchedulingInstance(example.input)).toEqual({
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
  it("assigns every job once without processor overlaps, including idle processors", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...smallInput,
        jobCount: 11,
        processorCount: 4,
        maximumDuration: 9,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output;
      expect(out.schedule.map((op) => op.job)).toEqual(
        Array.from({ length: 11 }, (_, i) => i),
      );
      for (let machine = 0; machine < 4; machine += 1) {
        const ops = out.schedule.filter((op) => op.machine === machine);
        let end = 0;
        for (const op of ops) {
          expect(op.start).toBe(end);
          expect(op.end - op.start).toBe(out.durations[op.job]);
          end = op.end;
        }
        expect(out.processorLoads[machine]).toBe(end);
      }
      expect(out.processorLoads.reduce((a, b) => a + b, 0)).toBe(
        out.durations.reduce((a, b) => a + b, 0),
      );
    }
    const result = tool.execute({
      ...smallInput,
      jobCount: 1,
      processorCount: 4,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.processorLoads).toEqual([2, 0, 0, 0]);
  });
  it("rejects reversed ranges and unsafe witness times", () => {
    expect(tool.execute({ ...smallInput, minimumDuration: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumDuration" }] },
    });
    expect(
      tool.execute({
        ...smallInput,
        processorCount: 1,
        minimumDuration: Number.MAX_SAFE_INTEGER,
        maximumDuration: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unsafe_schedule_time" }] },
    });
  });
});
