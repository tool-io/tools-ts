import { describe, expect, it } from "vitest";
import {
  calculateEdgeBoardLengthPalletTotal,
  edgeBoardLengthPalletTotalExample,
  runEdgeBoardLengthPalletTotal,
} from "./tool.js";

describe("edge-board-length-pallet-total", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEdgeBoardLengthPalletTotal(edgeBoardLengthPalletTotalExample.input),
    ).toEqual({
      ok: true,
      output: edgeBoardLengthPalletTotalExample.output,
    });
  });

  it("covers corners only when no bands are requested", () => {
    const result = runEdgeBoardLengthPalletTotal({
      loadHeightM: 2,
      loadLengthM: 1.5,
      loadWidthM: 1.1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.verticalEdgeBoardLengthM as number).toBe(8);
    expect(result.output.horizontalEdgeBoardLengthM as number).toBe(0);
    expect(result.output.totalEdgeBoardLengthM as number).toBe(8);
  });
  it("rejects negative band rows", () => {
    expect(
      runEdgeBoardLengthPalletTotal({
        loadHeightM: 1.8,
        loadLengthM: 1.2,
        loadWidthM: 1,
        horizontalBandRows: -1,
      }).ok,
    ).toBe(false);
  });
  it("rejects overflowing lengths", () => {
    expect(() =>
      calculateEdgeBoardLengthPalletTotal({
        loadHeightM: Number.MAX_VALUE,
        loadLengthM: 1,
        loadWidthM: 1,
      }),
    ).toThrow("outside the representable range");
  });
});
