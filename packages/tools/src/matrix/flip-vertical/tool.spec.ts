import { describe, expect, it } from "vitest";
import {
  flipVerticalExample,
  calculateFlipVertical,
  runFlipVertical,
} from "./tool.js";

describe("matrix/flip-vertical", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFlipVertical(flipVerticalExample.input)).toEqual({
      ok: true,
      output: flipVerticalExample.output,
    });
  });
  it("rejects invalid input (invalid_matrix)", () => {
    expect(runFlipVertical({ matrix: [] }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_matrix)", () => {
    expect(runFlipVertical({ matrix: [[1], [2, 3]] }).ok).toBe(false);
  });
  it("is an involution", () => {
    const once = runFlipVertical({
      matrix: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    });
    expect(once.ok).toBe(true);
    if (!once.ok) return;
    const twice = runFlipVertical({ matrix: once.output.flipped });
    expect(twice.ok).toBe(true);
    if (twice.ok)
      expect(twice.output.flipped).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
  });
});
