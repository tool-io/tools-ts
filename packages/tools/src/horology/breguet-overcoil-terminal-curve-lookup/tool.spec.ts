import { describe, expect, it } from "vitest";
import {
  lookupBreguetOvercoilTerminalCurve,
  overcoilLookupExample,
  runOvercoilLookup,
} from "./tool.js";

describe("Breguet overcoil terminal-curve lookup", () => {
  it("reproduces the canonical geometry fact", () => {
    expect(runOvercoilLookup(overcoilLookupExample.input)).toEqual({
      ok: true,
      output: overcoilLookupExample.output,
    });
  });

  it("covers concentric breathing", () => {
    expect(
      lookupBreguetOvercoilTerminalCurve({ overcoilFocus: "breathing" })
        .verifiedStatement,
    ).toContain("breathe more concentrically");
  });

  it("covers purpose", () => {
    expect(
      lookupBreguetOvercoilTerminalCurve({ overcoilFocus: "purpose" }).keyDate,
    ).toBe("concentric breathing");
  });

  it("states the design-specific limitation", () => {
    expect(
      lookupBreguetOvercoilTerminalCurve({ overcoilFocus: "limitation" })
        .verifiedStatement,
    ).toContain("not a universal guarantee");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runOvercoilLookup({ overcoilFocus: "alloy" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "overcoilFocus" }] },
      ok: false,
    });
  });
});
