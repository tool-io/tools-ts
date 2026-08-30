import { describe, expect, it } from "vitest";
import {
  lookupSiliconWatchComponentProperty,
  runSiliconProperty,
  siliconPropertyExample,
} from "./tool.js";

describe("silicon watch-component property lookup", () => {
  it("reproduces the canonical wear-resistance statement", () => {
    expect(runSiliconProperty(siliconPropertyExample.input)).toEqual({
      ok: true,
      output: siliconPropertyExample.output,
    });
  });

  it("covers the lubricant-free escape wheel", () => {
    expect(
      lookupSiliconWatchComponentProperty({ propertyFocus: "escapeWheel" })
        .verifiedStatement,
    ).toContain("required no lubricant");
  });

  it("covers the ETA balance-spring property list", () => {
    expect(
      lookupSiliconWatchComponentProperty({ propertyFocus: "balanceSpring" })
        .verifiedStatement,
    ).toContain("magnetic-field independence");
  });

  it("rejects an entire-watch maintenance-free interpretation", () => {
    expect(
      lookupSiliconWatchComponentProperty({ propertyFocus: "notUniversal" })
        .verifiedStatement,
    ).toContain("not make an entire watch maintenance-free");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runSiliconProperty({ propertyFocus: "density" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "propertyFocus" }] },
      ok: false,
    });
  });
});
