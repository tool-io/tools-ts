import { describe, expect, it } from "vitest";
import tool, { example, calculateSortingInversionChallenge } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Constrained inversion permutation", () => {
  lightweightModelTests(tool, calculateSortingInversionChallenge, example);
  it("lightweight independently identifies both inversion extremes", () => {
    const ascending = tool.execute({
      size: 4,
      minimumInversions: 0,
      maximumInversions: 0,
      seed: 42,
    });
    const descending = tool.execute({
      size: 4,
      minimumInversions: 6,
      maximumInversions: 6,
      seed: 42,
    });
    expect(ascending).toMatchObject({
      ok: true,
      output: {
        permutation: [1, 2, 3, 4],
        lehmerDigits: [0, 0, 0, 0],
        inversionCount: 0,
      },
    });
    expect(descending).toMatchObject({
      ok: true,
      output: {
        permutation: [4, 3, 2, 1],
        lehmerDigits: [3, 2, 1, 0],
        inversionCount: 6,
      },
    });
  });
  it("lightweight rejects inversion bounds impossible for the requested size", () => {
    expect(
      tool.execute({ ...example.input, maximumInversions: 7 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumInversions", code: "infeasible_inversions" }],
      },
    });
  });
});
