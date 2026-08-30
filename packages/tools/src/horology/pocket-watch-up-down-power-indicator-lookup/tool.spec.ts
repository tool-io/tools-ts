import { describe, expect, it } from "vitest";
import {
  lookupPocketWatchUpDownIndicator,
  runUpDownIndicator,
  upDownIndicatorExample,
} from "./tool.js";

describe("pocket watch UP/DOWN power-indicator lookup", () => {
  it("reproduces the canonical 18 May 1879 patent fact", () => {
    expect(runUpDownIndicator(upDownIndicatorExample.input)).toEqual({
      ok: true,
      output: upDownIndicatorExample.output,
    });
  });

  it("defines the display as a winding-state warning", () => {
    expect(
      lookupPocketWatchUpDownIndicator({ indicatorFocus: "meaning" })
        .verifiedStatement,
    ).toContain("winding-state indicator");
  });

  it("identifies a separate differential train", () => {
    expect(
      lookupPocketWatchUpDownIndicator({ indicatorFocus: "operation" })
        .verifiedStatement,
    ).toContain("separate train");
  });

  it("keeps UP/DOWN distinct from other power displays", () => {
    expect(
      lookupPocketWatchUpDownIndicator({ indicatorFocus: "terminology" })
        .verifiedStatement,
    ).toContain("specific historic display name");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runUpDownIndicator({ indicatorFocus: "alarm" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "indicatorFocus" }] },
      ok: false,
    });
  });
});
