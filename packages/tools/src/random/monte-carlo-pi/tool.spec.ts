import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calculateMonteCarloPi,
  monteCarloPiExample as example,
} from "./tool.js";

describe("Monte Carlo pi", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("counts an origin, a 3-4-5 boundary point, and a known exterior point independently", () => {
    const draws = [0, 0, 0.6, 0.8, 0.9, 0.9];
    let calls = 0;
    expect(
      calculateMonteCarloPi({ count: 3 }, { random: () => draws[calls++] }),
    ).toEqual({
      ok: true,
      output: {
        sampleCount: 3,
        points: [
          [0, 0],
          [0.6, 0.8],
          [0.9, 0.9],
        ],
        insideCircle: [true, true, false],
        insideCount: 2,
        estimate: 2.6666666666666665,
        randomness: { seed: null, source: "context" },
      },
    });
    expect(calls).toBe(6);
  });
  it("retains exact requested counts and derives all flags from the sampled coordinates", () => {
    const result = tool.execute({ count: 128, seed: 21 });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.points).toHaveLength(128);
    expect(result.output.insideCircle).toHaveLength(128);
    let inside = 0;
    result.output.points.forEach(([x, y], i) => {
      const flag = x * x + y * y <= 1;
      expect(result.output.insideCircle[i]).toBe(flag);
      if (flag) inside += 1;
    });
    expect(result.output.insideCount).toBe(inside);
    expect(result.output.estimate).toBe(inside / 32);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual({ ok: true, output: example.output });
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    expect(tool.execute({ count: 6 })).toEqual(tool.execute({ count: 6 }));
  });
  it("reports invalid counts and bad injected draws specifically", () => {
    for (const count of [0, -1, 4097, 1.5, NaN, Infinity])
      expect(tool.execute({ count })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: "count" }] },
      });
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute({ count: 1 }, { random: () => value })).toMatchObject(
        {
          ok: false,
          error: {
            issues: [{ code: "invalid_random_source", field: "random" }],
          },
        },
      );
    let calls = 0;
    expect(
      tool.execute({ count: 2 }, { random: () => (++calls === 2 ? 1 : 0) }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
    expect(calls).toBe(2);
    expect(
      tool.execute(
        { count: 1 },
        {
          random: () => {
            throw new Error("Failure");
          },
        },
      ),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
    expect(tool.execute({})).toMatchObject({
      ok: false,
      error: {
        issues: tool.inputSchema.required?.map((field) => ({
          code: "required_field",
          field,
        })),
      },
    });
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    expect(tool.execute({ count: 1, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
  });
});
