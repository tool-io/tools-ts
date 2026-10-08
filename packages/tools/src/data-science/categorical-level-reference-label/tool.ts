import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureName: string;
  readonly referenceLevel: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureName: { type: "string", maxLength: 8192, minLength: 1 },
    referenceLevel: { type: "string", maxLength: 8192 },
  },
  required: ["featureName", "referenceLevel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit categorical reference level without choosing model coding or interpreting a coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureName, referenceLevel } = request;
  const compute = (): Output => {
    H.domain(featureName.length > 0, "featureName");
    return {
      label:
        featureName + " [reference=" + JSON.stringify(referenceLevel) + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { featureName: "treatment", referenceLevel: "control" },
  output: { label: 'treatment [reference="control"]' },
} satisfies ToolExample<Input, Output>;
export const categoricalLevelReferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["data-science", "data science", "computer science"],
      keywords: ["data science", "computer science"],
    },
    id: "data-science/categorical-level-reference-label",
    title: "Categorical Level Reference Label",
    description:
      "Label an explicit categorical reference level without choosing model coding or interpreting a coefficient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureName: { type: "string", maxLength: 8192, minLength: 1 },
        referenceLevel: { type: "string", maxLength: 8192 },
      },
      required: ["featureName", "referenceLevel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "featureName",
          label: "Feature Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceLevel",
          label: "Reference Level",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = categoricalLevelReferenceLabelTool.execute;
export default categoricalLevelReferenceLabelTool;
