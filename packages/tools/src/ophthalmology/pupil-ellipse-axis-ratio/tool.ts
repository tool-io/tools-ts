import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly majorAxis: number; readonly minorAxis: number };
export type Output = { readonly axisRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    majorAxis: { type: "number", exclusiveMinimum: 0 },
    minorAxis: { type: "number", minimum: 0 },
  },
  required: ["majorAxis", "minorAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { axisRatio: { type: "number" } },
  required: ["axisRatio"],
} as const;
/** Calculate pupil ellipse axis ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { majorAxis, minorAxis } = request;
  const compute = (): Output => {
    H.positive(majorAxis);
    H.domain(minorAxis >= 0 && minorAxis <= majorAxis);
    return { axisRatio: minorAxis / majorAxis };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { majorAxis: 5, minorAxis: 3 },
  output: { axisRatio: 0.6 },
} satisfies ToolExample<Input, Output>;
export const pupilEllipseAxisRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/pupil-ellipse-axis-ratio",
    title: "Pupil Ellipse Axis Ratio Tool",
    description:
      "Calculate pupil ellipse axis ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        majorAxis: { type: "number", exclusiveMinimum: 0 },
        minorAxis: { type: "number", minimum: 0 },
      },
      required: ["majorAxis", "minorAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { axisRatio: { type: "number" } },
      required: ["axisRatio"],
    },
    ports: {
      inputs: [
        {
          id: "majorAxis",
          label: "Major Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minorAxis",
          label: "Minor Axis",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "axisRatio", label: "Axis Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pupilEllipseAxisRatioTool.execute;
export default pupilEllipseAxisRatioTool;
