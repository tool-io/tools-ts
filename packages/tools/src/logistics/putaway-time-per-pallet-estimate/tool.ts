import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PutawayTimePerPalletEstimateInput = {
  readonly totalPutawayMinutes: number;
  readonly palletsPutaway: number;
};

export type PutawayTimePerPalletEstimateOutput = {
  readonly minutesPerPallet: number;
  readonly palletsPerHour: number;
};

export const calculatePutawayTimePerPalletEstimate = (
  input: PutawayTimePerPalletEstimateInput,
): PutawayTimePerPalletEstimateOutput => {
  if (
    !Number.isFinite(input.totalPutawayMinutes) ||
    input.totalPutawayMinutes <= 0
  )
    return simpleError(
      "totalPutawayMinutes",
      "Total putaway minutes must be greater than zero.",
      "invalid_minutes",
    );
  if (!(Number.isSafeInteger(input.palletsPutaway) && input.palletsPutaway > 0))
    return simpleError(
      "palletsPutaway",
      "Pallets put away must be greater than zero.",
      "invalid_pallets",
    );
  const minutesPerPallet = input.totalPutawayMinutes / input.palletsPutaway;
  const palletsPerHour = 60 / minutesPerPallet;
  if (!Number.isFinite(minutesPerPallet) || !Number.isFinite(palletsPerHour))
    return simpleError(
      "totalPutawayMinutes",
      "The productivity result is outside the representable range.",
      "result_out_of_range",
    );
  return { minutesPerPallet, palletsPerHour };
};

export const putawayTimePerPalletEstimateExample = {
  input: { totalPutawayMinutes: 90, palletsPutaway: 15 },
  output: { minutesPerPallet: 6, palletsPerHour: 10 },
} satisfies ToolExample<
  PutawayTimePerPalletEstimateInput,
  PutawayTimePerPalletEstimateOutput
>;

export const putawayTimePerPalletEstimateTool = createSimpleTool({
  id: "logistics/putaway-time-per-pallet-estimate",
  title: "Putaway Time Per Pallet Estimate",
  description:
    "Estimate putaway productivity as minutes per pallet moved and the equivalent pallets per hour.",
  inputs: [
    {
      description: "Total minutes spent putting pallets away.",
      id: "totalPutawayMinutes",
      kind: "number",
      label: "Total minutes",
      minimum: Number.MIN_VALUE,
      unit: "min",
    },
    {
      description: "Number of pallets put away.",
      id: "palletsPutaway",
      kind: "integer",
      label: "Pallets",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Average minutes to put away one pallet.",
      id: "minutesPerPallet",
      kind: "number",
      label: "Minutes/pallet",
    },
    {
      description: "Equivalent pallets put away per hour.",
      id: "palletsPerHour",
      kind: "number",
      label: "Pallets/hour",
    },
  ],
  calculate: (input) =>
    calculatePutawayTimePerPalletEstimate({
      palletsPutaway: input.palletsPutaway as number,
      totalPutawayMinutes: input.totalPutawayMinutes as number,
    }),
});

export const runPutawayTimePerPalletEstimate =
  putawayTimePerPalletEstimateTool.execute;
export default putawayTimePerPalletEstimateTool;
