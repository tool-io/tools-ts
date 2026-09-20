import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  orthogonalMatrixExample as example,
  calculateOrthogonalMatrix,
} from "./tool.js";

describe("Random Orthogonal Matrix Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateOrthogonalMatrix(example.input)).toEqual({
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
  it("has the known Householder two-by-two factor and independent dot-product checks", () => {
    const draws = [0, 0.9, 0.9, 0];
    let i = 0;
    const result = tool.execute(
      { size: 2, minimumInteger: 3, maximumInteger: 4, maximumResidual: 1e-12 },
      { random: () => draws[i++] },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.q[0][0]).toBeCloseTo(-0.6, 14);
    expect(result.output.q[0][1]).toBeCloseTo(-0.8, 14);
    for (let seed = 0; seed < 10; seed += 1) {
      const generated = tool.execute({ ...example.input, size: 5, seed });
      if (!generated.ok) throw new Error("Expected success");
      const q = generated.output.q;
      for (let a = 0; a < 5; a += 1)
        for (let b = 0; b < 5; b += 1)
          expect(q.reduce((s, row) => s + row[a] * row[b], 0)).toBeCloseTo(
            a === b ? 1 : 0,
            10,
          );
    }
  });
  it("handles a zero source explicitly and enforces residual and range policies", () => {
    const zero = tool.execute({
      ...example.input,
      size: 3,
      minimumInteger: 0,
      maximumInteger: 0,
      maximumResidual: 0,
    });
    if (!zero.ok) throw new Error("Expected success");
    expect(zero.output.q).toEqual([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
    expect(zero.output.sourceWasZero).toBe(true);
    expect(zero.output.orthogonalityResidual).toBe(0);
    expect(tool.execute({ ...example.input, minimumInteger: 4 })).toMatchObject(
      { ok: false, error: { issues: [{ field: "maximumInteger" }] } },
    );
    expect(
      tool.execute({ ...example.input, maximumResidual: -1 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumResidual" }] },
    });
  });
});
