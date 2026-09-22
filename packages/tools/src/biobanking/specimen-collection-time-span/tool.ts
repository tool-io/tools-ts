import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly earliest: number; readonly latest: number };
export type Output = { readonly span: number; readonly midpoint: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { earliest: { type: "number" }, latest: { type: "number" } },
  required: ["earliest", "latest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { span: { type: "number" }, midpoint: { type: "number" } },
  required: ["span", "midpoint"],
} as const;
/** Summarize an explicit deidentified collection-time interval without stability inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliest, latest } = request;
  const compute = (): Output => {
    H.domain(latest >= earliest);
    return { span: latest - earliest, midpoint: earliest / 2 + latest / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliest: 10, latest: 14 },
  output: { span: 4, midpoint: 12 },
} satisfies ToolExample<Input, Output>;
export const specimenCollectionTimeSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/specimen-collection-time-span",
    title: "Specimen Collection Time Span Tool",
    description:
      "Summarize an explicit deidentified collection-time interval without stability inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { earliest: { type: "number" }, latest: { type: "number" } },
      required: ["earliest", "latest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { span: { type: "number" }, midpoint: { type: "number" } },
      required: ["span", "midpoint"],
    },
    ports: {
      inputs: [
        {
          id: "earliest",
          label: "Earliest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latest",
          label: "Latest",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "span", label: "Span", valueType: { type: "number" } },
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = specimenCollectionTimeSpanTool.execute;
export default specimenCollectionTimeSpanTool;
