import { describe, expect, it } from "vitest";
import {
  calculateSplitSleeperRestartEffectLookup,
  splitSleeperRestartEffectLookupExample,
  runSplitSleeperRestartEffectLookup,
} from "./tool.js";

describe("split-sleeper-restart-effect-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSplitSleeperRestartEffectLookup(
        splitSleeperRestartEffectLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: splitSleeperRestartEffectLookupExample.output,
    });
  });

  it("rejects a pair that totals fewer than ten hours", () => {
    expect(
      runSplitSleeperRestartEffectLookup({
        sleeperBerthHours: 5,
        otherOffDutyHours: 3,
      }),
    ).toEqual({
      ok: true,
      output: { qualifiesAsValidSplit: false, totalOffDutyHours: 8 },
    });
  });

  it("does not mistake two five-hour periods for a valid split", () => {
    expect(
      calculateSplitSleeperRestartEffectLookup({
        sleeperBerthHours: 5,
        otherOffDutyHours: 5,
      }),
    ).toEqual({ qualifiesAsValidSplit: false, totalOffDutyHours: 10 });
  });

  it("rejects negative and non-finite periods", () => {
    expect(
      runSplitSleeperRestartEffectLookup({
        sleeperBerthHours: -8,
        otherOffDutyHours: 3,
      }).ok,
    ).toBe(false);
    expect(() =>
      calculateSplitSleeperRestartEffectLookup({
        sleeperBerthHours: Number.POSITIVE_INFINITY,
        otherOffDutyHours: 3,
      }),
    ).toThrow("must be finite");
  });
});
