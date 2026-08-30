import { describe, expect, it } from "vitest";
import {
  bronzePatinaExample,
  lookupBronzePatinaFactor,
  runBronzePatina,
} from "./tool.js";

describe("bronze patina development-factor lookup", () => {
  it("reproduces the canonical no-fixed-timeline statement", () => {
    expect(runBronzePatina(bronzePatinaExample.input)).toEqual({
      ok: true,
      output: bronzePatinaExample.output,
    });
  });

  it("keeps alloy composition variable", () => {
    expect(
      lookupBronzePatinaFactor({ patinaFocus: "alloy" }).verifiedStatement,
    ).toContain("family of copper alloys");
  });

  it("identifies environmental exposure", () => {
    expect(
      lookupBronzePatinaFactor({ patinaFocus: "environmentalExposure" })
        .verifiedStatement,
    ).toContain("individual patina");
  });

  it("identifies skin-contact variability", () => {
    expect(
      lookupBronzePatinaFactor({ patinaFocus: "skinContact" })
        .verifiedStatement,
    ).toContain("varies");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runBronzePatina({ patinaFocus: "color" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "patinaFocus" }] },
      ok: false,
    });
  });
});
