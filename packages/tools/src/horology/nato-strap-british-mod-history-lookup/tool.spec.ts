import { describe, expect, it } from "vitest";
import {
  lookupNatoStrapHistory,
  natoStrapHistoryExample,
  runNatoStrapHistory,
} from "./tool.js";

describe("NATO strap British MoD history lookup", () => {
  it("reproduces the canonical 1973 creation fact", () => {
    expect(runNatoStrapHistory(natoStrapHistoryExample.input)).toEqual({
      ok: true,
      output: natoStrapHistoryExample.output,
    });
  });

  it("covers the original grey 20 mm specification", () => {
    expect(
      lookupNatoStrapHistory({ historyFocus: "originalSpecification" })
        .verifiedStatement,
    ).toContain("20 millimetres");
  });

  it("covers the two-spring-bar over-uniform construction", () => {
    expect(
      lookupNatoStrapHistory({ historyFocus: "construction" })
        .verifiedStatement,
    ).toContain("two spring bars");
  });

  it("explains the G-10 nickname", () => {
    expect(
      lookupNatoStrapHistory({ historyFocus: "g10Nickname" }).verifiedStatement,
    ).toContain("G-1098");
  });

  it("distinguishes the name NATO from original branding", () => {
    expect(
      lookupNatoStrapHistory({ historyFocus: "name" }).verifiedStatement,
    ).toContain("not a NATO-branded product");
  });
});
