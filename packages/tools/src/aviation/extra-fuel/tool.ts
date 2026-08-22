import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExtraFuelInput = {
  readonly plannedBlockFuelKg: number;
  readonly totalRequestedFuelKg: number;
};

export type ExtraFuelOutput = {
  readonly extraFuelKg: number;
};

export const extraFuelExample = {
  input: { plannedBlockFuelKg: 15600, totalRequestedFuelKg: 16000 },
  output: { extraFuelKg: 400 },
} satisfies ToolExample<ExtraFuelInput, ExtraFuelOutput>;

export const calculateExtraFuel = (input: ExtraFuelInput): ExtraFuelOutput => {
  if (input.totalRequestedFuelKg < input.plannedBlockFuelKg)
    simpleError(
      "totalRequestedFuelKg",
      "The requested fuel is less than the planned block fuel.",
      "insufficient_request",
    );
  return {
    extraFuelKg: input.totalRequestedFuelKg - input.plannedBlockFuelKg,
  };
};

export const extraFuelTool = createSimpleTool({
  calculate: (input) => calculateExtraFuel(input as unknown as ExtraFuelInput),
  description:
    "Compute the extra fuel carried above the planned block fuel from the total requested uplift.",
  id: "aviation/extra-fuel",
  inputs: [
    {
      description: "Total fuel requested for the flight.",
      id: "totalRequestedFuelKg",
      kind: "number",
      label: "Total requested fuel",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Planned block fuel without extras.",
      id: "plannedBlockFuelKg",
      kind: "number",
      label: "Planned block fuel",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Fuel carried above the planned block requirement.",
      format: "weight-kg",
      id: "extraFuelKg",
      kind: "number",
      label: "Extra fuel",
      unit: "kg",
    },
  ],
  title: "Extra Fuel Calculator",
});
export const runExtraFuel = extraFuelTool.execute;
export default extraFuelTool;
