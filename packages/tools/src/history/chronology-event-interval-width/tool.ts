import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly earliest: number; readonly latest: number };
export type Output = { readonly width: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { earliest: { type: "number" }, latest: { type: "number" } },
  required: ["earliest", "latest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" } },
  required: ["width"],
} as const;
/** Measure an explicit event interval on one supplied chronological axis, without interpreting calendar uncertainty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliest, latest } = request;
  const compute = (): Output => {
    H.domain(latest >= earliest);
    return { width: latest - earliest };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliest: 1800, latest: 1825 },
  output: { width: 25 },
} satisfies ToolExample<Input, Output>;
export const chronologyEventIntervalWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/chronology-event-interval-width",
    title: "Chronology Event Interval Width Tool",
    description:
      "Measure an explicit event interval on one supplied chronological axis, without interpreting calendar uncertainty.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { earliest: { type: "number" }, latest: { type: "number" } },
      required: ["earliest", "latest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "number" } },
      required: ["width"],
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
      outputs: [{ id: "width", label: "Width", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = chronologyEventIntervalWidthTool.execute;
export default chronologyEventIntervalWidthTool;
