import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conditionMean: number;
  readonly comparisonMean: number;
  readonly reverseSign: boolean;
};
export type Output = { readonly contrast: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionMean: { type: "number" },
    comparisonMean: { type: "number" },
    reverseSign: { type: "boolean" },
  },
  required: ["conditionMean", "comparisonMean", "reverseSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contrast: { type: "number" } },
  required: ["contrast"],
} as const;
/** Subtract supplied manipulation-check means under an explicit sign convention without a hypothesis test. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conditionMean, comparisonMean, reverseSign } = request;
  const compute = (): Output => {
    return {
      contrast: (conditionMean - comparisonMean) * (reverseSign ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { conditionMean: 6, comparisonMean: 4, reverseSign: false },
  output: { contrast: 2 },
} satisfies ToolExample<Input, Output>;
export const manipulationCheckContrastValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "experimental-psychology",
        "experimental psychology",
        "psychology",
      ],
      keywords: ["experimental psychology", "psychology"],
    },
    id: "experimental-psychology/manipulation-check-contrast-value",
    title: "Manipulation Check Contrast Value",
    description:
      "Subtract supplied manipulation-check means under an explicit sign convention without a hypothesis test.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionMean: { type: "number" },
        comparisonMean: { type: "number" },
        reverseSign: { type: "boolean" },
      },
      required: ["conditionMean", "comparisonMean", "reverseSign"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contrast: { type: "number" } },
      required: ["contrast"],
    },
    ports: {
      inputs: [
        {
          id: "conditionMean",
          label: "Condition Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "comparisonMean",
          label: "Comparison Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseSign",
          label: "Reverse Sign",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "contrast", label: "Contrast", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = manipulationCheckContrastValueTool.execute;
export default manipulationCheckContrastValueTool;
