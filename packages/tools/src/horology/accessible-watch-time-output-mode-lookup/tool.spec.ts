import { describe, expect, it } from "vitest";
import {
  accessibleOutputExample,
  lookupAccessibleWatchTimeOutput,
  runAccessibleOutput,
} from "./tool.js";

describe("accessible watch time-output mode lookup", () => {
  it("reproduces the canonical tactile-interface statement", () => {
    expect(runAccessibleOutput(accessibleOutputExample.input)).toEqual({
      ok: true,
      output: accessibleOutputExample.output,
    });
  });

  it("distinguishes speech from audible hands", () => {
    expect(
      lookupAccessibleWatchTimeOutput({ outputFocus: "audio" })
        .verifiedStatement,
    ).toContain("does not make");
  });

  it("recognizes haptic feedback", () => {
    expect(
      lookupAccessibleWatchTimeOutput({ outputFocus: "haptic" })
        .verifiedStatement,
    ).toContain("touch or vibration");
  });

  it("records Citizen's co-designed tactile watch", () => {
    expect(
      lookupAccessibleWatchTimeOutput({ outputFocus: "inclusiveDesign" })
        .verifiedStatement,
    ).toContain("blind and visually impaired users");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runAccessibleOutput({ outputFocus: "braille" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "outputFocus" }] },
      ok: false,
    });
  });
});
