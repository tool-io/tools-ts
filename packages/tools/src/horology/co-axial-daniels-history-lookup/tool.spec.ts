import { describe, expect, it } from "vitest";
import {
  coAxialHistoryExample,
  lookupCoAxialDanielsHistory,
  runCoAxialHistory,
} from "./tool.js";

describe("co-axial Daniels history lookup", () => {
  it("reproduces the canonical patent fact", () => {
    expect(runCoAxialHistory(coAxialHistoryExample.input)).toEqual({
      ok: true,
      output: coAxialHistoryExample.output,
    });
  });

  it("covers attribution", () => {
    expect(
      lookupCoAxialDanielsHistory({ historyFocus: "attribution" }),
    ).toMatchObject({ keyDate: "1976" });
  });

  it("covers the mechanism identifier", () => {
    expect(
      lookupCoAxialDanielsHistory({ historyFocus: "mechanism" }).keyDate,
    ).toBe("EP0018796");
  });

  it("covers series production", () => {
    expect(
      lookupCoAxialDanielsHistory({ historyFocus: "serialProduction" })
        .verifiedStatement,
    ).toContain("1999");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runCoAxialHistory({ historyFocus: "marketing" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "historyFocus" }] },
      ok: false,
    });
  });
});
