import { describe, expect, it } from "vitest";
import {
  lookupSeikoAstronHistory,
  runAstronHistory,
  astronHistoryExample,
} from "./tool.js";

describe("Seiko Astron 1969 launch history lookup", () => {
  it("reproduces the canonical 25 December 1969 launch", () => {
    expect(runAstronHistory(astronHistoryExample.input)).toEqual({
      ok: true,
      output: astronHistoryExample.output,
    });
  });

  it("dates the wristwatch prototype to 1967", () => {
    expect(
      lookupSeikoAstronHistory({ historyFocus: "prototype" }).keyDate,
    ).toBe("1967");
  });

  it("records the 8,192 Hz oscillator", () => {
    expect(
      lookupSeikoAstronHistory({ historyFocus: "oscillator" })
        .verifiedStatement,
    ).toContain("8,192 Hz");
  });

  it("keeps the published accuracy in seconds per month", () => {
    expect(
      lookupSeikoAstronHistory({ historyFocus: "accuracy" }).verifiedStatement,
    ).toContain("seconds per month");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runAstronHistory({ historyFocus: "GPS" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "historyFocus" }] },
      ok: false,
    });
  });
});
