import { describe, expect, it } from "vitest";
import {
  longNowExample,
  lookupLongNowClockStatus,
  runLongNow,
} from "./tool.js";

describe("Long Now 10,000-year clock status lookup", () => {
  it("reproduces the canonical West Texas assembly status", () => {
    expect(runLongNow(longNowExample.input)).toEqual({
      ok: true,
      output: longNowExample.output,
    });
  });

  it("identifies sunlight-harvested mechanical energy", () => {
    expect(
      lookupLongNowClockStatus({ statusFocus: "energy" }).verifiedStatement,
    ).toContain("sunlight");
  });

  it("records longevity, maintainability, and transparency", () => {
    expect(
      lookupLongNowClockStatus({ statusFocus: "designPrinciples" })
        .verifiedStatement,
    ).toContain("included manual");
  });

  it("dates the first prototype to 1999", () => {
    expect(
      lookupLongNowClockStatus({ statusFocus: "prototypeHistory" })
        .verifiedStatement,
    ).toContain("New Year's Eve 1999");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runLongNow({ statusFocus: "completion" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "statusFocus" }] },
      ok: false,
    });
  });
});
