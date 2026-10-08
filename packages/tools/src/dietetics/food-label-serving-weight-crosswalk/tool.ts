import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labelServingGrams: number;
  readonly consumedGrams: number;
  readonly amountPerLabelServing: number;
};
export type Output = {
  readonly labelServings: number;
  readonly consumedAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelServingGrams: { type: "number", exclusiveMinimum: 0 },
    consumedGrams: { type: "number", minimum: 0 },
    amountPerLabelServing: { type: "number", minimum: 0 },
  },
  required: ["labelServingGrams", "consumedGrams", "amountPerLabelServing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelServings: { type: "number" },
    consumedAmount: { type: "number" },
  },
  required: ["labelServings", "consumedAmount"],
} as const;
/** Scale an explicitly supplied food-label amount by measured consumed weight without selecting a dietary target. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labelServingGrams, consumedGrams, amountPerLabelServing } = request;
  const compute = (): Output => {
    (H.domain(labelServingGrams > 0, "labelServingGrams"), labelServingGrams);
    H.domain(consumedGrams >= 0 && amountPerLabelServing >= 0, "consumedGrams");
    return {
      labelServings: consumedGrams / labelServingGrams,
      consumedAmount:
        (amountPerLabelServing * consumedGrams) / labelServingGrams,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labelServingGrams: 40, consumedGrams: 60, amountPerLabelServing: 8 },
  output: { labelServings: 1.5, consumedAmount: 12 },
} satisfies ToolExample<Input, Output>;
export const foodLabelServingWeightCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dietetics", "health and medicine"],
      keywords: ["dietetics", "health and medicine"],
    },
    id: "dietetics/food-label-serving-weight-crosswalk",
    title: "Food Label Serving Weight Crosswalk",
    description:
      "Scale an explicitly supplied food-label amount by measured consumed weight without selecting a dietary target.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelServingGrams: { type: "number", exclusiveMinimum: 0 },
        consumedGrams: { type: "number", minimum: 0 },
        amountPerLabelServing: { type: "number", minimum: 0 },
      },
      required: ["labelServingGrams", "consumedGrams", "amountPerLabelServing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelServings: { type: "number" },
        consumedAmount: { type: "number" },
      },
      required: ["labelServings", "consumedAmount"],
    },
    ports: {
      inputs: [
        {
          id: "labelServingGrams",
          label: "Label Serving Grams",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "consumedGrams",
          label: "Consumed Grams",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "amountPerLabelServing",
          label: "Amount Per Label Serving",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "labelServings",
          label: "Label Servings",
          valueType: { type: "number" },
        },
        {
          id: "consumedAmount",
          label: "Consumed Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodLabelServingWeightCrosswalkTool.execute;
export default foodLabelServingWeightCrosswalkTool;
