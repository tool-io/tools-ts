import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  sqidsReversibleIdFixtureExample as example,
  calculateSqidsReversibleIdFixture,
} from "./tool.js";

describe("Random Sqids Reversible ID Fixture Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateSqidsReversibleIdFixture(example.input)).toEqual({
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
  it("retains the standard [1,2,3] => 86Rf07 fixture", () => {
    const draws = [0.1, 0.2, 0.3];
    expect(
      tool.execute(
        { minimum: 0, maximum: 9, tupleLength: 3, count: 1 },
        { random: () => draws.shift()! },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        fixtures: [
          {
            numbers: [1, 2, 3],
            id: "86Rf07",
            decoded: [1, 2, 3],
            roundTripVerified: true,
          },
        ],
      },
    });
  });
  it("round trips boundary values and reports repeats without a uniqueness claim", () => {
    for (const value of [0, Number.MAX_SAFE_INTEGER]) {
      const result = tool.execute({
        ...example.input,
        minimum: value,
        maximum: value,
        tupleLength: 16,
        count: 3,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      expect(result.output.duplicatePairs).toEqual([
        [0, 1],
        [0, 2],
        [1, 2],
      ]);
      for (const row of result.output.fixtures) {
        expect(row.numbers).toEqual(Array(16).fill(value));
        expect(row.decoded).toEqual(row.numbers);
        expect(row.roundTripVerified).toBe(true);
      }
    }
  });
  it("rejects invalid ranges, unsafe cardinality and tuple/resource limits", () => {
    for (const change of [
      { minimum: 10 },
      { minimum: -1 },
      { minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
      { tupleLength: 0 },
      { tupleLength: 17 },
      { count: 65 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
