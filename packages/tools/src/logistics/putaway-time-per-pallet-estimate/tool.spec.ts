import { describe, expect, it } from "vitest";
import {
  putawayTimePerPalletEstimateExample,
  runPutawayTimePerPalletEstimate,
} from "./tool.js";

describe("putaway-time-per-pallet-estimate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPutawayTimePerPalletEstimate(
        putawayTimePerPalletEstimateExample.input,
      ),
    ).toEqual({
      ok: true,
      output: putawayTimePerPalletEstimateExample.output,
    });
  });

  it("handles non-integer averages", () => {
    expect(
      runPutawayTimePerPalletEstimate({
        totalPutawayMinutes: 100,
        palletsPutaway: 8,
      }),
    ).toEqual({
      ok: true,
      output: { minutesPerPallet: 12.5, palletsPerHour: 4.8 },
    });
  });

  it("rejects zero pallets", () => {
    expect(
      runPutawayTimePerPalletEstimate({
        totalPutawayMinutes: 60,
        palletsPutaway: 0,
      }).ok,
    ).toBe(false);
  });
});
