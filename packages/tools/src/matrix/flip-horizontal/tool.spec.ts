import { describe, expect, it } from "vitest";
import {
  flipHorizontalExample,
  calculateFlipHorizontal,
  runFlipHorizontal,
} from "./tool.js";

describe("matrix/flip-horizontal", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFlipHorizontal(flipHorizontalExample.input)).toEqual({
      ok: true,
      output: flipHorizontalExample.output,
    });
  });
  it("rejects invalid input (invalid_matrix)", () => {
    expect(runFlipHorizontal({ matrix: [] }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_matrix)", () => {
    expect(runFlipHorizontal({ matrix: [[1], [2, 3]] }).ok).toBe(false);
  });
  it("is an involution", () => {
    const once = runFlipHorizontal({
      matrix: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    });
    expect(once.ok).toBe(true);
    if (!once.ok) return;
    const twice = runFlipHorizontal({ matrix: once.output.flipped });
    expect(twice.ok).toBe(true);
    if (twice.ok)
      expect(twice.output.flipped).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
  });
});
