import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceBatchMass: number;
  readonly targetBatchMass: number;
  readonly referenceIngredientMass: number;
};
export type Output = {
  readonly scaleFactor: number;
  readonly scaledIngredientMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceBatchMass: { type: "number", exclusiveMinimum: 0 },
    targetBatchMass: { type: "number", minimum: 0 },
    referenceIngredientMass: { type: "number", minimum: 0 },
  },
  required: [
    "referenceBatchMass",
    "targetBatchMass",
    "referenceIngredientMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleFactor: { type: "number" },
    scaledIngredientMass: { type: "number" },
  },
  required: ["scaleFactor", "scaledIngredientMass"],
} as const;
/** Scale an explicit ingredient mass proportionally between supplied batch masses without adjusting process conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceBatchMass, targetBatchMass, referenceIngredientMass } =
    request;
  const compute = (): Output => {
    (H.domain(referenceBatchMass > 0, "referenceBatchMass"),
      referenceBatchMass);
    H.domain(
      targetBatchMass >= 0 && referenceIngredientMass >= 0,
      "targetBatchMass",
    );
    return {
      scaleFactor: targetBatchMass / referenceBatchMass,
      scaledIngredientMass:
        referenceIngredientMass * (targetBatchMass / referenceBatchMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceBatchMass: 200,
    targetBatchMass: 500,
    referenceIngredientMass: 12,
  },
  output: { scaleFactor: 2.5, scaledIngredientMass: 30 },
} satisfies ToolExample<Input, Output>;
export const recipeBatchScaleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "food-technology",
        "food technology",
        "research and quality management",
      ],
      keywords: ["food technology", "research and quality management"],
    },
    id: "food-technology/recipe-batch-scale-factor",
    title: "Recipe Batch Scale Factor",
    description:
      "Scale an explicit ingredient mass proportionally between supplied batch masses without adjusting process conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceBatchMass: { type: "number", exclusiveMinimum: 0 },
        targetBatchMass: { type: "number", minimum: 0 },
        referenceIngredientMass: { type: "number", minimum: 0 },
      },
      required: [
        "referenceBatchMass",
        "targetBatchMass",
        "referenceIngredientMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleFactor: { type: "number" },
        scaledIngredientMass: { type: "number" },
      },
      required: ["scaleFactor", "scaledIngredientMass"],
    },
    ports: {
      inputs: [
        {
          id: "referenceBatchMass",
          label: "Reference Batch Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetBatchMass",
          label: "Target Batch Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceIngredientMass",
          label: "Reference Ingredient Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaleFactor",
          label: "Scale Factor",
          valueType: { type: "number" },
        },
        {
          id: "scaledIngredientMass",
          label: "Scaled Ingredient Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recipeBatchScaleFactorTool.execute;
export default recipeBatchScaleFactorTool;
