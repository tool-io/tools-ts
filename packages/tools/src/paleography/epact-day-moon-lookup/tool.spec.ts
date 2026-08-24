import { describe, expect, it } from "vitest";
import { epactDayMoonLookupExample, runEpactDayMoonLookup } from "./tool.js";

describe("epact-day-moon-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEpactDayMoonLookup(epactDayMoonLookupExample.input)).toEqual({
      ok: true,
      output: epactDayMoonLookupExample.output,
    });
  });

  it("uses the Julian epact sequence from golden number one", () => {
    expect(runEpactDayMoonLookup({ goldenNumber: 1 })).toEqual({
      ok: true,
      output: { epact: 0, epactDisplay: "30", daysUntilMeanNewMoon: 0 },
    });
    const result = runEpactDayMoonLookup({ goldenNumber: 19 });
    expect(result).toEqual({
      ok: true,
      output: { epact: 18, epactDisplay: "18", daysUntilMeanNewMoon: 12 },
    });
  });

  it("rejects golden numbers outside 1-19", () => {
    expect(runEpactDayMoonLookup({ goldenNumber: 20 }).ok).toBe(false);
    expect(runEpactDayMoonLookup({ goldenNumber: 0 }).ok).toBe(false);
  });
});
