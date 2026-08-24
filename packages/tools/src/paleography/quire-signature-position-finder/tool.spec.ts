import { describe, expect, it } from "vitest";
import {
  quireSignaturePositionFinderExample,
  runQuireSignaturePositionFinder,
} from "./tool.js";

describe("quire-signature-position-finder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runQuireSignaturePositionFinder(
        quireSignaturePositionFinderExample.input,
      ),
    ).toEqual({ ok: true, output: quireSignaturePositionFinderExample.output });
  });

  it("sends an innermost leaf to the second half with the same bifolium", () => {
    const result = runQuireSignaturePositionFinder({
      quireNumber: 1,
      leafInQuire: 5,
      leavesPerQuire: 8,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.partnerLeafNumber as number).toBe(4);
    expect(result.output.quireHalf as string).toBe("second");
    expect(result.output.bifoliumIndexFromOutside as number).toBe(4);
  });

  it("rejects odd leaf counts", () => {
    expect(
      runQuireSignaturePositionFinder({
        quireNumber: 1,
        leafInQuire: 1,
        leavesPerQuire: 7,
      }).ok,
    ).toBe(false);
  });

  it("rejects leaves beyond the quire size", () => {
    expect(
      runQuireSignaturePositionFinder({
        quireNumber: 1,
        leafInQuire: 9,
        leavesPerQuire: 8,
      }).ok,
    ).toBe(false);
  });
});
