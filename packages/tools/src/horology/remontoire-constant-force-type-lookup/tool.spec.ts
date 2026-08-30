import { describe, expect, it } from "vitest";
import {
  lookupRemontoireConstantForceType,
  remontoireExample,
  runRemontoire,
} from "./tool.js";

describe("remontoire constant-force type lookup", () => {
  it("reproduces the canonical secondary-power purpose", () => {
    expect(runRemontoire(remontoireExample.input)).toEqual({
      ok: true,
      output: remontoireExample.output,
    });
  });

  it("distinguishes spring and gravity remontoires", () => {
    expect(
      lookupRemontoireConstantForceType({ remontoireFocus: "spring" })
        .verifiedStatement,
    ).toContain("secondary spring");
    expect(
      lookupRemontoireConstantForceType({ remontoireFocus: "gravity" })
        .verifiedStatement,
    ).toContain("descending weight");
  });

  it("distinguishes escapement and train placement", () => {
    expect(
      lookupRemontoireConstantForceType({
        remontoireFocus: "escapementLocation",
      }).verifiedStatement,
    ).toContain("upstream wheel");
  });

  it("keeps gravity remontoires out of the general portable-watch case", () => {
    expect(
      lookupRemontoireConstantForceType({ remontoireFocus: "watchConstraint" })
        .verifiedStatement,
    ).toContain("not generally portable");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runRemontoire({ remontoireFocus: "tourbillon" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "remontoireFocus" }] },
      ok: false,
    });
  });
});
