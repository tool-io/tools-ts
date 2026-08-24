import { describe, expect, it } from "vitest";
import {
  ragWoodpulpEraBoundaryCheckerExample,
  runRagWoodpulpEraBoundaryChecker,
} from "./tool.js";

describe("rag-woodpulp-era-boundary-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRagWoodpulpEraBoundaryChecker(
        ragWoodpulpEraBoundaryCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: ragWoodpulpEraBoundaryCheckerExample.output,
    });
  });

  it("keeps medieval paper in the rag-only era", () => {
    const result = runRagWoodpulpEraBoundaryChecker({ productionYear: 1350 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.materialEra as string).toBe("rag_only_era");
    expect(result.output.woodPulpLikelyInUse as boolean).toBe(false);
  });

  it("rejects years before the documented range", () => {
    expect(runRagWoodpulpEraBoundaryChecker({ productionYear: 100 }).ok).toBe(
      false,
    );
  });
});
