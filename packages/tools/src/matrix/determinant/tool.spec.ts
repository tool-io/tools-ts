import { describe, expect, it } from "vitest";
import {
  determinantExample,
  calculateDeterminant,
  runDeterminant,
} from "./tool.js";

describe("matrix/determinant", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDeterminant(determinantExample.input)).toEqual({
      ok: true,
      output: determinantExample.output,
    });
  });
  it("rejects invalid input (not_square_matrix)", () => {
    expect(runDeterminant({ matrix: [[1, 2], [3]] }).ok).toBe(false);
  });
  it("rejects invalid input (not_square_matrix)", () => {
    expect(runDeterminant({ matrix: [] }).ok).toBe(false);
  });
  it("matches the classic two-by-two expansion", () => {
    const result = runDeterminant({
      matrix: [
        [3, 8],
        [4, 6],
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.determinant).toBe(-14);
  });

  it("reports zero for a singular matrix", () => {
    const singular = runDeterminant({
      matrix: [
        [1, 2],
        [2, 4],
      ],
    });
    expect(singular.ok).toBe(true);
    if (!singular.ok) return;
    expect(singular.output.determinant).toBe(0);
  });
});
