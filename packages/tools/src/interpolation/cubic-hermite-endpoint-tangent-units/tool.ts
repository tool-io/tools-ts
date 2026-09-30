import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly slope: number; readonly span: number };
export type Output = { readonly normalizedTangent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slope: { type: "number" },
    span: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["slope", "span"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedTangent: { type: "number" } },
  required: ["normalizedTangent"],
} as const;
/** Calculate cubic hermite endpoint tangent units from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { slope, span } = input;
  const compute = (): Output => {
    H.positive(span);
    return { normalizedTangent: slope * span };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { slope: 3, span: 2 },
  output: { normalizedTangent: 6 },
} satisfies ToolExample<Input, Output>;
export const cubicHermiteEndpointTangentUnitsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/cubic-hermite-endpoint-tangent-units",
    title: "Cubic Hermite Endpoint Tangent Units Tool",
    description:
      "Calculate cubic hermite endpoint tangent units from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slope: { type: "number" },
        span: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["slope", "span"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalizedTangent: { type: "number" } },
      required: ["normalizedTangent"],
    },
    ports: {
      inputs: [
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedTangent",
          label: "Normalized Tangent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cubicHermiteEndpointTangentUnitsTool.execute;
export default cubicHermiteEndpointTangentUnitsTool;
