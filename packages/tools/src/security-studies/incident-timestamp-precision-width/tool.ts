import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly earliest: number; readonly latest: number };
export type Output = { readonly width: number; readonly midpoint: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { earliest: { type: "number" }, latest: { type: "number" } },
  required: ["earliest", "latest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" }, midpoint: { type: "number" } },
  required: ["width", "midpoint"],
} as const;
/** Calculate incident timestamp precision width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliest, latest } = request;
  const compute = (): Output => {
    H.domain(latest >= earliest);
    return { width: latest - earliest, midpoint: earliest / 2 + latest / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliest: 100, latest: 110 },
  output: { width: 10, midpoint: 105 },
} satisfies ToolExample<Input, Output>;
export const incidentTimestampPrecisionWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/incident-timestamp-precision-width",
    title: "Incident Timestamp Precision Width Tool",
    description:
      "Calculate incident timestamp precision width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { earliest: { type: "number" }, latest: { type: "number" } },
      required: ["earliest", "latest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "number" }, midpoint: { type: "number" } },
      required: ["width", "midpoint"],
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
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = incidentTimestampPrecisionWidthTool.execute;
export default incidentTimestampPrecisionWidthTool;
