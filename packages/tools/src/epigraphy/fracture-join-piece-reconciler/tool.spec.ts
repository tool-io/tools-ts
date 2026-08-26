import { describe, expect, it } from "vitest";
import {
  fractureJoinPieceReconcilerExample,
  runFractureJoinPieceReconciler,
} from "./tool.js";

describe("fracture-join-piece-reconciler", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFractureJoinPieceReconciler(fractureJoinPieceReconcilerExample.input),
    ).toEqual({
      ok: true,
      output: fractureJoinPieceReconcilerExample.output,
    });
  });

  it("reports full completion for a fully joined assemblage", () => {
    const result = runFractureJoinPieceReconciler({
      fragmentCount: 4,
      matchedJoinCount: 4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.unjoinedFragmentCount as number).toBe(0);
    expect(result.output.joinCompletionPercent as number).toBe(100);
  });

  it("rejects more matches than fragments", () => {
    expect(
      runFractureJoinPieceReconciler({ fragmentCount: 4, matchedJoinCount: 5 })
        .ok,
    ).toBe(false);
  });
});
