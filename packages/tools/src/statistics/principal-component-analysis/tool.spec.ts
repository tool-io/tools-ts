import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  principalComponentAnalysisExample as example,
  calculatePrincipalComponentAnalysis,
} from "./tool.js";

describe("Principal Component Analysis Tool", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculatePrincipalComponentAnalysis(example.input)).toEqual({
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
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
  });
  it("reconstructs the source through a full basis and has orthonormal components", () => {
    const observations = [
      [1, 3, 2],
      [2, 0, -1],
      [4, 2, 5],
      [-1, 4, 0],
    ];
    const result = tool.execute({ observations, componentCount: 3 });
    if (!result.ok) throw new Error("Expected success");
    const out = result.output;
    out.components.forEach((a, i) =>
      out.components.forEach((b, j) =>
        expect(a.reduce((s, v, k) => s + v * b[k], 0)).toBeCloseTo(
          i === j ? 1 : 0,
          10,
        ),
      ),
    );
    observations.forEach((row, i) =>
      row.forEach((value, column) =>
        expect(
          out.means[column] +
            out.scores[i].reduce(
              (sum, score, k) => sum + score * out.components[k][column],
              0,
            ),
        ).toBeCloseTo(value, 10),
      ),
    );
    expect(out.explainedVarianceRatio.reduce((s, v) => s + v, 0)).toBeCloseTo(
      1,
      10,
    );
    out.components.forEach((component) => {
      const pivot = component.reduce(
        (best, v, i) => (Math.abs(v) > Math.abs(component[best]) ? i : best),
        0,
      );
      expect(component[pivot]).toBeGreaterThanOrEqual(0);
    });
  });
  it("has known sample variance, permits constant and wide data, and reports invalid dimensions", () => {
    const result = tool.execute({
      observations: [
        [5, 7],
        [5, 7],
        [5, 7],
      ],
      componentCount: 2,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.explainedVariance).toEqual([0, 0]);
    expect(result.output.explainedVarianceRatio).toEqual([0, 0]);
    const wide = tool.execute({
      observations: [
        [0, 1, 2],
        [2, 3, 4],
      ],
      componentCount: 2,
    });
    if (!wide.ok) throw new Error("Expected success");
    expect(wide.output.components).toHaveLength(2);
    expect(tool.execute({ ...example.input, componentCount: 3 })).toMatchObject(
      {
        ok: false,
        error: {
          issues: [
            { field: "componentCount", code: "infeasible_component_count" },
          ],
        },
      },
    );
    expect(
      tool.execute({ observations: [[1], [2, 3]], componentCount: 1 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "observations", code: "ragged_matrix" }] },
    });
    expect(
      tool.execute({ observations: [[-1e308], [1e308]], componentCount: 1 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "observations", code: "numeric_overflow" }] },
    });
  });
});
