import { describe, expect, it } from "vitest";
import {
  lookupMarineChronometerGimbal,
  marineGimbalExample,
  runMarineGimbal,
} from "./tool.js";

describe("marine chronometer gimbal-purpose lookup", () => {
  it("reproduces the canonical two-ring gimbal statement", () => {
    expect(runMarineGimbal(marineGimbalExample.input)).toEqual({
      ok: true,
      output: marineGimbalExample.output,
    });
  });

  it("identifies the protective movement bowl", () => {
    expect(
      lookupMarineChronometerGimbal({ gimbalFocus: "bowl" }).verifiedStatement,
    ).toContain("protective bowl");
  });

  it("keeps gimbals separate from the wooden box", () => {
    expect(
      lookupMarineChronometerGimbal({ gimbalFocus: "box" }).verifiedStatement,
    ).toContain("housed the gimbal");
  });

  it("does not make a chronometer immune to handling", () => {
    expect(
      lookupMarineChronometerGimbal({ gimbalFocus: "handling" })
        .verifiedStatement,
    ).toContain("not make the instrument immune");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runMarineGimbal({ gimbalFocus: "rate" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "gimbalFocus" }] },
      ok: false,
    });
  });
});
