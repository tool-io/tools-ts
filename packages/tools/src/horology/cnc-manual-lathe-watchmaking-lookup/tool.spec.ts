import { describe, expect, it } from "vitest";
import {
  cncHandLatheExample,
  lookupCncManualLatheWatchmaking,
  runCncHandLathe,
} from "./tool.js";

describe("CNC versus manual-lathe watchmaking lookup", () => {
  it("reproduces the canonical inspection-dependent statement", () => {
    expect(runCncHandLathe(cncHandLatheExample.input)).toEqual({
      ok: true,
      output: cncHandLatheExample.output,
    });
  });

  it("describes CNC repeatability without guaranteeing quality", () => {
    expect(
      lookupCncManualLatheWatchmaking({ processFocus: "cnc" })
        .verifiedStatement,
    ).toContain("repeatable positioning");
  });

  it("describes manual-lathe operator control", () => {
    expect(
      lookupCncManualLatheWatchmaking({ processFocus: "manualLathe" })
        .verifiedStatement,
    ).toContain("operator's setup");
  });

  it("recognizes hybrid workflows", () => {
    expect(
      lookupCncManualLatheWatchmaking({ processFocus: "hybrid" }).keyDate,
    ).toBe("current workshop practice");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runCncHandLathe({ processFocus: "3dPrinting" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "processFocus" }] },
      ok: false,
    });
  });
});
