import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly label: string;
  readonly labels: readonly string[];
  readonly probabilities: readonly number[];
};
export type Output = { readonly found: boolean; readonly probability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["label", "labels", "probabilities"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { found: { type: "boolean" }, probability: { type: "number" } },
  required: ["found", "probability"],
} as const;
/** Look up exact label text in an explicit unique-label probability table, using a false flag and zero sentinel for an absent label. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label, labels, probabilities } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(labels.length === probabilities.length, "probabilities");
      H.domain(new Set(labels).size === labels.length, "labels");
      probabilities.forEach(
        (value) => (H.domain(value >= 0 && value <= 1, "probabilities"), value),
      );
      H.domain(
        Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1) <=
          Number.EPSILON * probabilities.length,
        "probabilities",
      );
      const index = labels.indexOf(label);
      return {
        found: index >= 0,
        probability: index < 0 ? 0 : probabilities[index],
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { label: "B", labels: ["A", "B"], probabilities: [0.25, 0.75] },
  output: { found: true, probability: 0.75 },
} satisfies ToolExample<Input, Output>;
export const categoricalLabelProbabilityLookupTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["probability", "mathematics"],
      keywords: ["probability", "mathematics"],
    },
    id: "probability/categorical-label-probability-lookup",
    title: "Categorical Label Probability Lookup",
    description:
      "Look up exact label text in an explicit unique-label probability table, using a false flag and zero sentinel for an absent label.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["label", "labels", "probabilities"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        found: { type: "boolean" },
        probability: { type: "number" },
      },
      required: ["found", "probability"],
    },
    ports: {
      inputs: [
        {
          id: "label",
          label: "Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        {
          id: "probability",
          label: "Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = categoricalLabelProbabilityLookupTool.execute;
export default categoricalLabelProbabilityLookupTool;
