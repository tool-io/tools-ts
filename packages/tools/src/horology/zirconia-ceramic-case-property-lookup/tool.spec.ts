import { describe, expect, it } from "vitest";
import {
  lookupZirconiaCeramicProperty,
  runZirconiaProperty,
  zirconiaPropertyExample,
} from "./tool.js";

describe("zirconia ceramic case property lookup", () => {
  it("reproduces the canonical Mohs range", () => {
    expect(runZirconiaProperty(zirconiaPropertyExample.input)).toEqual({
      ok: true,
      output: zirconiaPropertyExample.output,
    });
  });

  it("keeps Mohs hardness distinct from toughness", () => {
    expect(
      lookupZirconiaCeramicProperty({ propertyFocus: "hardness" })
        .verifiedStatement,
    ).toContain("not impact toughness");
  });

  it("states that properties vary with processing", () => {
    expect(
      lookupZirconiaCeramicProperty({ propertyFocus: "toughness" })
        .verifiedStatement,
    ).toContain("vary");
  });

  it("identifies polished zirconia watch use", () => {
    expect(
      lookupZirconiaCeramicProperty({ propertyFocus: "watchUse" })
        .verifiedStatement,
    ).toContain("decorative watch material");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(
      runZirconiaProperty({ propertyFocus: "waterproofing" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "propertyFocus" }] },
      ok: false,
    });
  });
});
