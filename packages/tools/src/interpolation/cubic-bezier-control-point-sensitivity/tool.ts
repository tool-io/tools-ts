import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly parameter: number; readonly control: number };
export type Output = { readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parameter: { type: "number", minimum: 0, maximum: 1 },
    control: { type: "integer", minimum: 0, maximum: 3 },
  },
  required: ["parameter", "control"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" } },
  required: ["weight"],
} as const;
/** Calculate cubic bezier control point sensitivity from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { parameter, control } = input;
  const compute = (): Output => {
    H.probability(parameter);
    H.integer(control, 0, 3);
    const t = parameter,
      u = 1 - t;
    return {
      weight:
        control === 0
          ? u ** 3
          : control === 1
            ? 3 * u * u * t
            : control === 2
              ? 3 * u * t * t
              : t ** 3,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { parameter: 0.5, control: 1 },
  output: { weight: 0.375 },
} satisfies ToolExample<Input, Output>;
export const cubicBezierControlPointSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/cubic-bezier-control-point-sensitivity",
    title: "Cubic Bezier Control Point Sensitivity Tool",
    description:
      "Calculate cubic bezier control point sensitivity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parameter: { type: "number", minimum: 0, maximum: 1 },
        control: { type: "integer", minimum: 0, maximum: 3 },
      },
      required: ["parameter", "control"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weight: { type: "number" } },
      required: ["weight"],
    },
    ports: {
      inputs: [
        {
          id: "parameter",
          label: "Parameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "control",
          label: "Control",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cubicBezierControlPointSensitivityTool.execute;
export default cubicBezierControlPointSensitivityTool;
