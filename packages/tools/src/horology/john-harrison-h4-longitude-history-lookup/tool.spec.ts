import { describe, expect, it } from "vitest";
import {
  harrisonH4Example,
  lookupJohnHarrisonH4History,
  runHarrisonH4,
} from "./tool.js";

describe("John Harrison H4 longitude history lookup", () => {
  it("reproduces the canonical 1759 completion fact", () => {
    expect(runHarrisonH4(harrisonH4Example.input)).toEqual({
      ok: true,
      output: harrisonH4Example.output,
    });
  });

  it("covers the 1714 Longitude Act", () => {
    expect(
      lookupJohnHarrisonH4History({ historyFocus: "act" }).verifiedStatement,
    ).toContain("three-seconds-per-day");
  });

  it("covers the Barbados voyage", () => {
    expect(
      lookupJohnHarrisonH4History({ historyFocus: "barbadosTrial" }).keyDate,
    ).toBe("1764–1765");
  });

  it("keeps the payment dispute separate from the technical trial", () => {
    expect(
      lookupJohnHarrisonH4History({ historyFocus: "paymentDispute" })
        .verifiedStatement,
    ).toContain("£10,000");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runHarrisonH4({ historyFocus: "H5" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "historyFocus" }] },
      ok: false,
    });
  });
});
