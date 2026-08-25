import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ZoneBasedRateTableStepLookupInput = {
  readonly rateTableUsd: number[];
  readonly zoneNumber: number;
};

export type ZoneBasedRateTableStepLookupOutput = {
  readonly selectedZoneNumber: number;
  readonly rateUsd: number;
};

export const calculateZoneBasedRateTableStepLookup = (
  input: ZoneBasedRateTableStepLookupInput,
): ZoneBasedRateTableStepLookupOutput => {
  if (input.rateTableUsd.length === 0)
    return simpleError(
      "rateTableUsd",
      "The rate table must contain at least one zone.",
      "invalid_table",
    );
  if (!(Number.isSafeInteger(input.zoneNumber) && input.zoneNumber >= 1))
    return simpleError(
      "zoneNumber",
      "The zone number must be a positive whole number.",
      "invalid_zone",
    );
  if (input.zoneNumber > input.rateTableUsd.length)
    return simpleError(
      "zoneNumber",
      "The zone number is beyond the published rate table.",
      "out_of_range",
    );
  for (let index = 0; index < input.rateTableUsd.length; index += 1) {
    const value = input.rateTableUsd[index];
    if (!Number.isFinite(value) || value < 0)
      return simpleError(
        "rateTableUsd",
        `Rate at zone ${index + 1} must be finite and non-negative.`,
        "invalid_table",
      );
  }
  const rateUsd = input.rateTableUsd[input.zoneNumber - 1];
  return { selectedZoneNumber: input.zoneNumber, rateUsd };
};

export const zoneBasedRateTableStepLookupExample = {
  input: { rateTableUsd: [215.4, 268.9, 331.2, 402.75], zoneNumber: 3 },
  output: { selectedZoneNumber: 3, rateUsd: 331.2 },
} satisfies ToolExample<
  ZoneBasedRateTableStepLookupInput,
  ZoneBasedRateTableStepLookupOutput
>;

export const zoneBasedRateTableStepLookupTool = createSimpleTool({
  id: "logistics/zone-based-rate-table-step-lookup",
  title: "Zone-Based Rate Table Step Lookup",
  description:
    "Look up the freight charge for a shipment by selecting the row of your zone-based rate table that matches the lane's zone number.",
  inputs: [
    {
      description:
        "Rate for each zone in US dollars, ordered from zone 1 upward.",
      id: "rateTableUsd",
      kind: "numberList",
      label: "Rate table",
    },
    {
      description: "Zone number of the lane, starting at 1.",
      id: "zoneNumber",
      kind: "integer",
      label: "Zone",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Zone number whose rate was selected.",
      id: "selectedZoneNumber",
      kind: "integer",
      label: "Zone",
    },
    {
      description: "Rate in US dollars for the selected zone.",
      id: "rateUsd",
      kind: "number",
      label: "Rate",
      minimum: 0,
      unit: "USD",
    },
  ],
  calculate: (input) =>
    calculateZoneBasedRateTableStepLookup({
      rateTableUsd: input.rateTableUsd as number[],
      zoneNumber: input.zoneNumber as number,
    }),
});

export const runZoneBasedRateTableStepLookup =
  zoneBasedRateTableStepLookupTool.execute;
export default zoneBasedRateTableStepLookupTool;
