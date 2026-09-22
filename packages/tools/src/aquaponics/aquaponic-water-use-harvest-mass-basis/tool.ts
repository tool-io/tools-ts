import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly withdrawal: number;
  readonly recovered: number;
  readonly fishHarvest: number;
  readonly plantHarvest: number;
};
export type Output = {
  readonly netWater: number;
  readonly waterPerCombinedHarvest: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withdrawal: { type: "number" },
    recovered: { type: "number", minimum: 0 },
    fishHarvest: { type: "number", minimum: 0 },
    plantHarvest: { type: "number", minimum: 0 },
  },
  required: ["withdrawal", "recovered", "fishHarvest", "plantHarvest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netWater: { type: "number" },
    waterPerCombinedHarvest: { type: "number" },
  },
  required: ["netWater", "waterPerCombinedHarvest"],
} as const;
/** Calculate aquaponic water use harvest mass basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { withdrawal, recovered, fishHarvest, plantHarvest } = request;
  const compute = (): Output => {
    H.domain(
      withdrawal >= recovered &&
        recovered >= 0 &&
        fishHarvest >= 0 &&
        plantHarvest >= 0 &&
        fishHarvest + plantHarvest > 0,
    );
    return {
      netWater: withdrawal - recovered,
      waterPerCombinedHarvest:
        (withdrawal - recovered) / (fishHarvest + plantHarvest),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { withdrawal: 100, recovered: 20, fishHarvest: 10, plantHarvest: 30 },
  output: { netWater: 80, waterPerCombinedHarvest: 2 },
} satisfies ToolExample<Input, Output>;
export const aquaponicWaterUseHarvestMassBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/aquaponic-water-use-harvest-mass-basis",
    title: "Aquaponic Water Use Harvest Mass Basis Tool",
    description:
      "Calculate aquaponic water use harvest mass basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withdrawal: { type: "number" },
        recovered: { type: "number", minimum: 0 },
        fishHarvest: { type: "number", minimum: 0 },
        plantHarvest: { type: "number", minimum: 0 },
      },
      required: ["withdrawal", "recovered", "fishHarvest", "plantHarvest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netWater: { type: "number" },
        waterPerCombinedHarvest: { type: "number" },
      },
      required: ["netWater", "waterPerCombinedHarvest"],
    },
    ports: {
      inputs: [
        {
          id: "withdrawal",
          label: "Withdrawal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recovered",
          label: "Recovered",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fishHarvest",
          label: "Fish Harvest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plantHarvest",
          label: "Plant Harvest",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netWater", label: "Net Water", valueType: { type: "number" } },
        {
          id: "waterPerCombinedHarvest",
          label: "Water Per Combined Harvest",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaponicWaterUseHarvestMassBasisTool.execute;
export default aquaponicWaterUseHarvestMassBasisTool;
