import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossHarvestKg: number;
  readonly containerTareKg: number;
  readonly retainedWaterKg: number;
};
export type Output = { readonly fishMassKg: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossHarvestKg: { type: "number", minimum: 0 },
    containerTareKg: { type: "number", minimum: 0 },
    retainedWaterKg: { type: "number", minimum: 0 },
  },
  required: ["grossHarvestKg", "containerTareKg", "retainedWaterKg"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fishMassKg: { type: "number" } },
  required: ["fishMassKg"],
} as const;
/** Subtract separately measured container and retained-water masses from one recorded gross harvest. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossHarvestKg, containerTareKg, retainedWaterKg } = request;
  const compute = (): Output => {
    H.domain(
      grossHarvestKg >= 0 &&
        containerTareKg >= 0 &&
        retainedWaterKg >= 0 &&
        containerTareKg + retainedWaterKg <= grossHarvestKg,
      "grossHarvestKg",
    );
    return { fishMassKg: grossHarvestKg - containerTareKg - retainedWaterKg };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossHarvestKg: 120, containerTareKg: 10, retainedWaterKg: 5 },
  output: { fishMassKg: 105 },
} satisfies ToolExample<Input, Output>;
export const harvestNetGrossMassTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["aquaculture", "agriculture"],
        keywords: ["aquaculture", "agriculture"],
      },
      id: "aquaculture/harvest-net-gross-mass",
      title: "Harvest Net Gross Mass",
      description:
        "Subtract separately measured container and retained-water masses from one recorded gross harvest.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossHarvestKg: { type: "number", minimum: 0 },
          containerTareKg: { type: "number", minimum: 0 },
          retainedWaterKg: { type: "number", minimum: 0 },
        },
        required: ["grossHarvestKg", "containerTareKg", "retainedWaterKg"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { fishMassKg: { type: "number" } },
        required: ["fishMassKg"],
      },
      ports: {
        inputs: [
          {
            id: "grossHarvestKg",
            label: "Gross Harvest Kg",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "containerTareKg",
            label: "Container Tare Kg",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retainedWaterKg",
            label: "Retained Water Kg",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fishMassKg",
            label: "Fish Mass Kg",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = harvestNetGrossMassTool.execute;
export default harvestNetGrossMassTool;
