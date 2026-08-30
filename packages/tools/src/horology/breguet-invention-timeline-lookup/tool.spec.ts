import { describe, expect, it } from "vitest";
import {
  breguetInventionExample,
  lookupBreguetInventionTimeline,
  runBreguetInvention,
} from "./tool.js";

describe("Breguet invention timeline lookup", () => {
  it("reproduces the canonical 1801 tourbillon patent fact", () => {
    expect(runBreguetInvention(breguetInventionExample.input)).toEqual({
      ok: true,
      output: breguetInventionExample.output,
    });
  });

  it("dates the overcoil to 1795", () => {
    expect(
      lookupBreguetInventionTimeline({ inventionFocus: "overcoil" }).keyDate,
    ).toBe("1795");
  });

  it("dates the constant-force escapement patent to 1798", () => {
    expect(
      lookupBreguetInventionTimeline({ inventionFocus: "constantForce" })
        .verifiedStatement,
    ).toContain("1798");
  });

  it("states that the selected list is not exhaustive", () => {
    expect(
      lookupBreguetInventionTimeline({ inventionFocus: "notExhaustive" })
        .verifiedStatement,
    ).toContain("not an exhaustive catalogue");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(
      runBreguetInvention({ inventionFocus: "minuteRepeater" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "inventionFocus" }] },
      ok: false,
    });
  });
});
