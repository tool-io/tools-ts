import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fishToPlant: number;
  readonly plantToFish: number;
  readonly freshToFish: number;
  readonly fishLoss: number;
};
export type Output = {
  readonly fishNet: number;
  readonly plantTransferNet: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fishToPlant: { type: "number", minimum: 0 },
    plantToFish: { type: "number", minimum: 0 },
    freshToFish: { type: "number", minimum: 0 },
    fishLoss: { type: "number", minimum: 0 },
  },
  required: ["fishToPlant", "plantToFish", "freshToFish", "fishLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fishNet: { type: "number" },
    plantTransferNet: { type: "number" },
  },
  required: ["fishNet", "plantTransferNet"],
} as const;
/** Calculate fish plant water exchange balance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fishToPlant, plantToFish, freshToFish, fishLoss } = request;
  const compute = (): Output => {
    H.domain(
      fishToPlant >= 0 && plantToFish >= 0 && freshToFish >= 0 && fishLoss >= 0,
    );
    return {
      fishNet: plantToFish + freshToFish - fishToPlant - fishLoss,
      plantTransferNet: fishToPlant - plantToFish,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fishToPlant: 100, plantToFish: 90, freshToFish: 20, fishLoss: 5 },
  output: { fishNet: 5, plantTransferNet: 10 },
} satisfies ToolExample<Input, Output>;
export const fishPlantWaterExchangeBalanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/fish-plant-water-exchange-balance-term",
    title: "Fish Plant Water Exchange Balance Term Tool",
    description:
      "Calculate fish plant water exchange balance term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fishToPlant: { type: "number", minimum: 0 },
        plantToFish: { type: "number", minimum: 0 },
        freshToFish: { type: "number", minimum: 0 },
        fishLoss: { type: "number", minimum: 0 },
      },
      required: ["fishToPlant", "plantToFish", "freshToFish", "fishLoss"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fishNet: { type: "number" },
        plantTransferNet: { type: "number" },
      },
      required: ["fishNet", "plantTransferNet"],
    },
    ports: {
      inputs: [
        {
          id: "fishToPlant",
          label: "Fish To Plant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plantToFish",
          label: "Plant To Fish",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freshToFish",
          label: "Fresh To Fish",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fishLoss",
          label: "Fish Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fishNet", label: "Fish Net", valueType: { type: "number" } },
        {
          id: "plantTransferNet",
          label: "Plant Transfer Net",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishPlantWaterExchangeBalanceTermTool.execute;
export default fishPlantWaterExchangeBalanceTermTool;
