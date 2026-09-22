import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly span: number; readonly rise: number };
export type Output = { readonly radius: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    span: { type: "number", exclusiveMinimum: 0 },
    rise: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["span", "rise"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radius: { type: "number" } },
  required: ["radius"],
} as const;
/** Find the circular-arch radius from chord span and positive sagitta in matching length units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { span, rise } = request;
  const compute = (): Output => {
    H.positive(span);
    H.positive(rise);
    return { radius: (span * span) / (8 * rise) + rise / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { span: 8, rise: 2 },
  output: { radius: 5 },
} satisfies ToolExample<Input, Output>;
export const archSegmentRadiusFromRiseSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/arch-segment-radius-from-rise-span",
    title: "Arch Segment Radius From Rise Span Tool",
    description:
      "Find the circular-arch radius from chord span and positive sagitta in matching length units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        span: { type: "number", exclusiveMinimum: 0 },
        rise: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["span", "rise"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radius: { type: "number" } },
      required: ["radius"],
    },
    ports: {
      inputs: [
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rise",
          label: "Rise",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "radius", label: "Radius", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = archSegmentRadiusFromRiseSpanTool.execute;
export default archSegmentRadiusFromRiseSpanTool;
