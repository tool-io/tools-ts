import { describe, expect, it } from "vitest";
import { rotate90Example, calculateRotate90, runRotate90 } from "./tool.js";

describe("matrix/rotate-90", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRotate90(rotate90Example.input)).toEqual({
      ok: true,
      output: rotate90Example.output,
    });
  });
  it("rejects invalid input (invalid_matrix)", () => {
    expect(runRotate90({ matrix: [] }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_matrix)", () => {
    expect(runRotate90({ matrix: [[1], [2, 3]] }).ok).toBe(false);
  });
  it("rotates counterclockwise on demand", () => {
    const result = runRotate90({
      matrix: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      direction: "counterclockwise",
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.rotated).toEqual([
        [3, 6],
        [2, 5],
        [1, 4],
      ]);
  });

  it("undoes itself with opposite rotations", () => {
    const cw = runRotate90({
      matrix: [
        [1, 2],
        [3, 4],
      ],
    });
    expect(cw.ok).toBe(true);
    if (!cw.ok) return;
    const back = runRotate90({
      matrix: cw.output.rotated,
      direction: "counterclockwise",
    });
    expect(back.ok).toBe(true);
    if (back.ok)
      expect(back.output.rotated).toEqual([
        [1, 2],
        [3, 4],
      ]);
  });
});
