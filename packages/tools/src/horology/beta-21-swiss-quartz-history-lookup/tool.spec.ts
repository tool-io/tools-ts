import { describe, expect, it } from "vitest";
import {
  beta21HistoryExample,
  lookupBeta21History,
  runBeta21History,
} from "./tool.js";

describe("Beta 21 Swiss quartz history lookup", () => {
  it("reproduces the canonical twenty-manufacturer consortium", () => {
    expect(runBeta21History(beta21HistoryExample.input)).toEqual({
      ok: true,
      output: beta21HistoryExample.output,
    });
  });

  it("dates the Beta 1 and Beta 2 prototypes to 1967", () => {
    expect(lookupBeta21History({ historyFocus: "prototypes" }).keyDate).toBe(
      "1967",
    );
  });

  it("dates the industrial presentation to Basel Fair 1970", () => {
    expect(
      lookupBeta21History({ historyFocus: "industrialLaunch" }).keyDate,
    ).toBe("1970 Basel Watch Fair");
  });

  it("keeps the reported production count approximate", () => {
    expect(
      lookupBeta21History({ historyFocus: "productionVolume" })
        .verifiedStatement,
    ).toContain("about 6,000");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runBeta21History({ historyFocus: "brand" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "historyFocus" }] },
      ok: false,
    });
  });
});
