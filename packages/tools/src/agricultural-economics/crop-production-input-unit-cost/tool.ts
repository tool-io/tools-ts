import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputCost: number;
  readonly outputQuantity: number;
};
export type Output = { readonly inputCostPerOutputUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputCost: { type: "number", minimum: 0 },
    outputQuantity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["inputCost", "outputQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inputCostPerOutputUnit: { type: "number" } },
  required: ["inputCostPerOutputUnit"],
} as const;
/** Allocate one explicitly supplied crop input cost over a positive output quantity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputCost, outputQuantity } = request;
  const compute = (): Output => {
    H.domain(inputCost >= 0, "inputCost");
    (H.domain(
      Number.isFinite(outputQuantity) && outputQuantity > 0,
      "outputQuantity",
    ),
      outputQuantity);
    return { inputCostPerOutputUnit: inputCost / outputQuantity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputCost: 600, outputQuantity: 150 },
  output: { inputCostPerOutputUnit: 4 },
} satisfies ToolExample<Input, Output>;
export const cropProductionInputUnitCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/crop-production-input-unit-cost",
    title: "Crop Production Input Unit Cost",
    description:
      "Allocate one explicitly supplied crop input cost over a positive output quantity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputCost: { type: "number", minimum: 0 },
        outputQuantity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["inputCost", "outputQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inputCostPerOutputUnit: { type: "number" } },
      required: ["inputCostPerOutputUnit"],
    },
    ports: {
      inputs: [
        {
          id: "inputCost",
          label: "Input Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputQuantity",
          label: "Output Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "inputCostPerOutputUnit",
          label: "Input Cost Per Output Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropProductionInputUnitCostTool.execute;
export default cropProductionInputUnitCostTool;
