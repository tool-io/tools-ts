import { describe, expect, it } from "vitest";
import {
  cylinderHistoryExample,
  lookupCylinderEscapementHistory,
  runCylinderHistory,
} from "./tool.js";

describe("cylinder escapement frictional-rest history lookup", () => {
  it("reproduces the canonical patent-history example", () => {
    expect(runCylinderHistory(cylinderHistoryExample.input)).toEqual({
      ok: true,
      output: cylinderHistoryExample.output,
    });
  });

  it("covers frictional contact", () => {
    expect(
      lookupCylinderEscapementHistory({ historyFocus: "contact" }).fact,
    ).toContain("sliding contact");
  });

  it("covers the service limitation", () => {
    expect(
      lookupCylinderEscapementHistory({ historyFocus: "limitation" }).fact,
    ).toContain("frequent cleaning");
  });

  it("covers the comparison with detached escapements", () => {
    expect(
      lookupCylinderEscapementHistory({ historyFocus: "performance" }).keyDate,
    ).toBe("comparison");
  });

  it("rejects an unsupported history focus at the public boundary", () => {
    expect(runCylinderHistory({ historyFocus: "lubrication" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "historyFocus" }] },
      ok: false,
    });
  });
});
