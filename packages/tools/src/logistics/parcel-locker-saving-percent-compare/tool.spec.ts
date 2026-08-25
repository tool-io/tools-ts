import { describe, expect, it } from "vitest";
import {
  parcelLockerSavingPercentCompareExample,
  runParcelLockerSavingPercentCompare,
} from "./tool.js";

describe("logistics/parcel-locker-saving-percent-compare", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runParcelLockerSavingPercentCompare(
        parcelLockerSavingPercentCompareExample.input,
      ),
    ).toEqual({
      ok: true,
      output: parcelLockerSavingPercentCompareExample.output,
    });
  });

  it("reports a negative saving when the locker costs more", () => {
    const result = runParcelLockerSavingPercentCompare({
      homeDeliveryCostPerParcel: 4,
      lockerCostPerParcel: 5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.savingPercent as number).toBe(-25);
  });

  it("rejects zero home delivery cost", () => {
    expect(
      runParcelLockerSavingPercentCompare({
        homeDeliveryCostPerParcel: 0,
        lockerCostPerParcel: 1,
      }).ok,
    ).toBe(false);
  });
});
