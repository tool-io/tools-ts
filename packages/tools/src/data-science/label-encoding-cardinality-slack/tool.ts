import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labels: readonly string[];
  readonly capacity: number;
};
export type Output = { readonly cardinality: number; readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    capacity: { type: "integer", minimum: 0 },
  },
  required: ["labels", "capacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cardinality: { type: "integer" }, slack: { type: "integer" } },
  required: ["cardinality", "slack"],
} as const;
/** Calculate label encoding cardinality slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labels, capacity } = request;
  const compute = (): Output => {
    H.integer(capacity, 0);
    return {
      cardinality: new Set(labels).size,
      slack: capacity - new Set(labels).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labels: ["a", "b", "a"], capacity: 4 },
  output: { cardinality: 2, slack: 2 },
} satisfies ToolExample<Input, Output>;
export const labelEncodingCardinalitySlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/label-encoding-cardinality-slack",
    title: "Label Encoding Cardinality Slack Tool",
    description:
      "Calculate label encoding cardinality slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        capacity: { type: "integer", minimum: 0 },
      },
      required: ["labels", "capacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cardinality: { type: "integer" },
        slack: { type: "integer" },
      },
      required: ["cardinality", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "cardinality",
          label: "Cardinality",
          valueType: { type: "integer" },
        },
        { id: "slack", label: "Slack", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = labelEncodingCardinalitySlackTool.execute;
export default labelEncodingCardinalitySlackTool;
