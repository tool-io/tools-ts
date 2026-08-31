import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
it("uses three swaps for one four-dancer permutation cycle", () => {
  const target = ["B", "C", "D", "A"],
    output = calculate({ ...example.input, targetDancerIdsBySlot: target }),
    actual = [...example.input.currentDancerIdsBySlot];
  expect(output.minimumUnrestrictedPairwiseSlotSwaps).toBe(3);
  expect(output.dancersChangingSlots).toBe(4);
  for (const [a, b] of output.plannedSwapSlotPairs)
    [actual[a], actual[b]] = [actual[b], actual[a]];
  expect(actual).toEqual(target);
});
it("matches the cycle lower bound across all four-dancer permutations", () => {
  const permutations = (xs: readonly string[]): string[][] =>
    xs.length === 0
      ? [[]]
      : xs.flatMap((x, i) =>
          permutations(xs.filter((_, j) => j !== i)).map((t) => [x, ...t]),
        );
  const start = ["A", "B", "C", "D"];
  for (const target of permutations(start)) {
    const seen = new Set<number>();
    let cycles = 0;
    for (let i = 0; i < 4; i++)
      if (!seen.has(i)) {
        cycles++;
        let p = i;
        while (!seen.has(p)) {
          seen.add(p);
          p = start.indexOf(target[p]);
        }
      }
    expect(
      calculate({ ...example.input, targetDancerIdsBySlot: target })
        .minimumUnrestrictedPairwiseSlotSwaps,
    ).toBe(4 - cycles);
  }
});
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-8,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("computes independent canonical values", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects mistyped, nonfinite and sparse evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v)) {
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
        expect(tool.execute({ ...example.input, [k]: Array(1) })).toMatchObject(
          { ok: false },
        );
      }
    }
  });
  it("is deterministic and preserves evidence", () => {
    const input = JSON.parse(
        JSON.stringify(example.input),
      ) as typeof example.input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("rejects invalid domains", () => {
    const input = {
      ...example.input,
      targetDancerIdsBySlot: ["A", "B", "C", "E"],
    };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("bounds evidence and rejects inherited sparse slots", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (Array.isArray(v)) {
        const invalid =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0, 0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: invalid })).toMatchObject({
          ok: false,
        });
        const sparse = Array(1);
        Object.setPrototypeOf(
          sparse,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: sparse })).toThrow();
      }
    }
  });
  it("handles independent boundary evidence", () => {
    const input = {
      ...example.input,
      targetDancerIdsBySlot: ["A", "B", "C", "D"],
    };
    close(calculate(input), {
      dancersChangingSlots: 0,
      minimumUnrestrictedPairwiseSlotSwaps: 0,
      plannedSwapSlotPairs: [],
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        dancersChangingSlots: 0,
        minimumUnrestrictedPairwiseSlotSwaps: 0,
        plannedSwapSlotPairs: [],
      });
  });
});
