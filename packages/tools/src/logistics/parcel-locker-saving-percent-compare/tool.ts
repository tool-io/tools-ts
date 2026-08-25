import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParcelLockerSavingPercentCompareInput = {
  readonly homeDeliveryCostPerParcel: number;
  readonly lockerCostPerParcel: number;
};

export type ParcelLockerSavingPercentCompareOutput = {
  readonly savingPercent: number;
  readonly savingPerParcel: number;
};

export const calculateParcelLockerSavingPercentCompare = (
  input: ParcelLockerSavingPercentCompareInput,
): ParcelLockerSavingPercentCompareOutput => {
  if (
    !Number.isFinite(input.homeDeliveryCostPerParcel) ||
    input.homeDeliveryCostPerParcel <= 0
  )
    return simpleError(
      "homeDeliveryCostPerParcel",
      "Home delivery cost must be greater than zero.",
      "invalid_cost",
    );
  if (
    !Number.isFinite(input.lockerCostPerParcel) ||
    input.lockerCostPerParcel < 0
  )
    return simpleError(
      "lockerCostPerParcel",
      "Locker delivery cost must be finite and non-negative.",
      "invalid_cost",
    );
  const savingPerParcel =
    input.homeDeliveryCostPerParcel - input.lockerCostPerParcel;
  const savingPercent =
    (savingPerParcel / input.homeDeliveryCostPerParcel) * 100;
  if (!Number.isFinite(savingPerParcel) || !Number.isFinite(savingPercent))
    return simpleError(
      "lockerCostPerParcel",
      "The cost comparison is outside the representable range.",
      "result_out_of_range",
    );
  return {
    savingPerParcel,
    savingPercent,
  };
};

export const parcelLockerSavingPercentCompareExample = {
  input: { homeDeliveryCostPerParcel: 6.5, lockerCostPerParcel: 4 },
  output: { savingPercent: 38.46153846153847, savingPerParcel: 2.5 },
} satisfies ToolExample<
  ParcelLockerSavingPercentCompareInput,
  ParcelLockerSavingPercentCompareOutput
>;

export const parcelLockerSavingPercentCompareTool = createSimpleTool({
  id: "logistics/parcel-locker-saving-percent-compare",
  title: "Parcel Locker Saving Percent Comparison",
  description:
    "Compare locker versus home-delivery cost per parcel and express the saving per parcel and as a percentage of home delivery.",
  inputs: [
    {
      description: "Cost per parcel delivered to a residential address.",
      id: "homeDeliveryCostPerParcel",
      kind: "number",
      label: "Home delivery cost",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Cost per parcel delivered to a parcel locker.",
      id: "lockerCostPerParcel",
      kind: "number",
      label: "Locker cost",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Saving as percent of home-delivery cost; negative means the locker costs more.",
      id: "savingPercent",
      kind: "number",
      label: "Saving percent",
    },
    {
      description: "Absolute saving per parcel in currency units.",
      id: "savingPerParcel",
      kind: "number",
      label: "Saving per parcel",
    },
  ],
  calculate: (input) =>
    calculateParcelLockerSavingPercentCompare({
      homeDeliveryCostPerParcel: input.homeDeliveryCostPerParcel as number,
      lockerCostPerParcel: input.lockerCostPerParcel as number,
    }),
});

export const runParcelLockerSavingPercentCompare =
  parcelLockerSavingPercentCompareTool.execute;
export default parcelLockerSavingPercentCompareTool;
