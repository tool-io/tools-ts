import { describe, expect, it } from "vitest";
import {
  anticipatoryGovernanceExample,
  lookupAnticipatoryGovernanceLoop,
  runAnticipatoryGovernance,
} from "./tool.js";

describe("anticipatory governance feedback loop lookup", () => {
  it("reproduces its canonical example", () => {
    expect(
      runAnticipatoryGovernance(anticipatoryGovernanceExample.input),
    ).toEqual({
      ok: true,
      output: anticipatoryGovernanceExample.output,
    });
  });

  it("looks up the sense stage", () => {
    expect(
      lookupAnticipatoryGovernanceLoop({ loopStage: "sense" }).loopArtifact,
    ).toBe("Signal register");
  });

  it("looks up the review stage", () => {
    expect(
      lookupAnticipatoryGovernanceLoop({ loopStage: "review" }).loopOwner,
    ).toBe("Evaluation team");
  });

  it("rejects an unsupported loop stage at the public boundary", () => {
    expect(runAnticipatoryGovernance({ loopStage: "forecast" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "loopStage" }] },
      ok: false,
    });
  });
});
