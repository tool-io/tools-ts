import { describe, expect, it } from "vitest";
import {
  guillocheProcessExample,
  lookupGuillocheDialCommissionProcess,
  runGuillocheProcess,
} from "./tool.js";

describe("guilloché dial artisan process lookup", () => {
  it("reproduces the canonical commission contract", () => {
    expect(runGuillocheProcess(guillocheProcessExample.input)).toEqual({
      ok: true,
      output: guillocheProcessExample.output,
    });
  });

  it("requires flat, clean blank preparation", () => {
    expect(
      lookupGuillocheDialCommissionProcess({ processFocus: "blankPreparation" })
        .processStage,
    ).toContain("flat, clean");
  });

  it("distinguishes rose and straight-line engines", () => {
    expect(
      lookupGuillocheDialCommissionProcess({ processFocus: "machineSetup" })
        .processStage,
    ).toContain("cams or rosettes");
  });

  it("requires inspection evidence at acceptance", () => {
    expect(
      lookupGuillocheDialCommissionProcess({ processFocus: "qualityEvidence" })
        .processStage,
    ).toContain("Acceptance evidence");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runGuillocheProcess({ processFocus: "pricing" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "processFocus" }] },
      ok: false,
    });
  });
});
