import { describe, expect, it } from "vitest";
import { nthRootExample, nthRootTool, runNthRoot } from "./tool.js";

describe("Nth Root Calculator", () => {
  it.each([
    [16, 2, 4],
    [2.25, 2, 1.5],
    [8, 3, 2],
    [32, 5, 2],
    [-8, 3, -2],
    [0, 2, 0],
    [0, 99, 0],
  ])("calculates principal real roots", (value, degree, root) =>
    expect(runNthRoot({ degree, value })).toEqual({
      ok: true,
      output: { root },
    }),
  );

  it("calculates irrational roots", () => {
    const squareRoot = runNthRoot({ degree: 2, value: 2 });
    const cubeRoot = runNthRoot({ degree: 3, value: 7 });

    expect(squareRoot.ok && squareRoot.output.root).toBeCloseTo(Math.SQRT2, 12);
    expect(cubeRoot.ok && cubeRoot.output.root).toBeCloseTo(7 ** (1 / 3), 12);
  });

  it("rejects unsupported degrees and non-real roots", () => {
    expect(runNthRoot({ value: 4, degree: 0 }).ok).toBe(false);
    expect(runNthRoot({ value: 4, degree: 1 }).ok).toBe(false);
    expect(runNthRoot({ value: 4, degree: 2.5 }).ok).toBe(false);
    expect(runNthRoot({ value: -4, degree: 2 }).ok).toBe(false);
  });

  it("rejects missing and non-finite values", () => {
    expect(runNthRoot({ degree: 2 }).ok).toBe(false);
    expect(runNthRoot({ degree: 2, value: Number.NaN }).ok).toBe(false);
    expect(runNthRoot({ degree: 2, value: Number.POSITIVE_INFINITY }).ok).toBe(
      false,
    );
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(nthRootExample))).toEqual(nthRootExample);
    expect(runNthRoot(nthRootExample.input)).toEqual({
      ok: true,
      output: { root: 4 },
    });
    expect(nthRootTool.inputSchema.properties?.degree).toMatchObject({
      minimum: 2,
    });
  });
});
