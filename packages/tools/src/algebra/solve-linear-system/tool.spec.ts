import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calculateSolveLinearSystem,
  solveLinearSystemExample as example,
} from "./tool.js";

describe("general linear system solver", () => {
  it("matches its row-pivoting canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("returns a hand-derived affine solution family and verifies it against the original equations", () => {
    const input = {
      coefficients: [
        [1, 2, 3],
        [2, 4, 6],
      ],
      rightHandSide: [4, 8],
    };
    const result = calculateSolveLinearSystem(input);
    if (!result.ok) throw new Error("Expected success");
    expect(result.output).toEqual({
      augmentedRank: 1,
      coefficientRank: 1,
      nullspaceBasis: [
        [-2, 1, 0],
        [-3, 0, 1],
      ],
      particularSolution: [4, 0, 0],
      reducedAugmentedMatrix: [
        [1, 2, 3, 4],
        [0, 0, 0, 0],
      ],
      solutionType: "infinite",
    });
    input.coefficients.forEach((row, i) => {
      expect(
        row.reduce(
          (sum, a, j) => sum + a * result.output.particularSolution[j],
          0,
        ),
      ).toBe(input.rightHandSide[i]);
      for (const vector of result.output.nullspaceBasis)
        expect(row.reduce((sum, a, j) => sum + a * vector[j], 0)).toBe(0);
    });
  });
  it("recognizes contradictions and still exposes the coefficient nullspace", () => {
    expect(
      tool.execute({
        coefficients: [
          [1, 1],
          [2, 2],
        ],
        rightHandSide: [2, 5],
      }),
    ).toEqual({
      ok: true,
      output: {
        augmentedRank: 2,
        coefficientRank: 1,
        nullspaceBasis: [[-1, 1]],
        particularSolution: [],
        reducedAugmentedMatrix: [
          [1, 1, 0],
          [0, 0, 1],
        ],
        solutionType: "inconsistent",
      },
    });
    expect(
      tool.execute({ coefficients: [[0, 0]], rightHandSide: [0] }),
    ).toEqual({
      ok: true,
      output: {
        augmentedRank: 0,
        coefficientRank: 0,
        nullspaceBasis: [
          [1, 0],
          [0, 1],
        ],
        particularSolution: [0, 0],
        reducedAugmentedMatrix: [[0, 0, 0]],
        solutionType: "infinite",
      },
    });
  });
  it("retains overdetermined consistent equations and does not mutate input", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    tool.execute(input);
    expect(input).toEqual(example.input);
    const result = tool.execute({
      coefficients: [
        [1, 0],
        [0, 1],
        [1, 1],
      ],
      rightHandSide: [2, 3, 5],
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.particularSolution).toEqual([2, 3]);
    expect(result.output.solutionType).toBe("unique");
  });
  it("makes the zero-threshold convention explicit and reports unrepresentable solutions", () => {
    expect(
      tool.execute({ coefficients: [[1e-15]], rightHandSide: [1e-15] }),
    ).toMatchObject({
      ok: true,
      output: { solutionType: "unique", particularSolution: [1] },
    });
    expect(
      tool.execute({
        coefficients: [[1e-15]],
        rightHandSide: [1e-15],
        absoluteTolerance: 1e-12,
      }),
    ).toMatchObject({
      ok: true,
      output: { solutionType: "infinite", particularSolution: [0] },
    });
    expect(
      tool.execute({ coefficients: [[1e-308]], rightHandSide: [1e308] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow", field: "rightHandSide" }] },
    });
  });
  it("rejects dimension, dense-data, finite-value and resource violations specifically", () => {
    expect(
      tool.execute({ coefficients: [[1, 2], [3]], rightHandSide: [1, 2] }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "ragged_coefficients", field: "coefficients" }],
      },
    });
    expect(
      tool.execute({ coefficients: [[1]], rightHandSide: [1, 2] }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "dimension_mismatch", field: "rightHandSide" }],
      },
    });
    for (const coefficients of [
      [],
      [[NaN]],
      [[Infinity]],
      Array(1),
      Array.from({ length: 33 }, () => [1]),
    ])
      expect(tool.execute({ coefficients, rightHandSide: [1] })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: "coefficients" }] },
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
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
  });
});
