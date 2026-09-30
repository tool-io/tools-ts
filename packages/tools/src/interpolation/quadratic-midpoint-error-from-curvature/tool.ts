import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly curvature: number; readonly span: number };
export type Output = { readonly interpolantMinusFunction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    curvature: { type: "number" },
    span: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["curvature", "span"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { interpolantMinusFunction: { type: "number" } },
  required: ["interpolantMinusFunction"],
} as const;
/** Calculate quadratic midpoint error from curvature from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { curvature, span } = input;
  const compute = (): Output => {
    H.positive(span);
    return { interpolantMinusFunction: (curvature * span * span) / 8 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { curvature: 2, span: 4 },
  output: { interpolantMinusFunction: 4 },
} satisfies ToolExample<Input, Output>;
export const quadraticMidpointErrorFromCurvatureTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/quadratic-midpoint-error-from-curvature",
      title: "Quadratic Midpoint Error From Curvature Tool",
      description:
        "Calculate quadratic midpoint error from curvature from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          curvature: { type: "number" },
          span: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["curvature", "span"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { interpolantMinusFunction: { type: "number" } },
        required: ["interpolantMinusFunction"],
      },
      ports: {
        inputs: [
          {
            id: "curvature",
            label: "Curvature",
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
            id: "interpolantMinusFunction",
            label: "Interpolant Minus Function",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = quadraticMidpointErrorFromCurvatureTool.execute;
export default quadraticMidpointErrorFromCurvatureTool;
