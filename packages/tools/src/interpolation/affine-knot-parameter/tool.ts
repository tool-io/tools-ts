import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly knot: number;
  readonly left: number;
  readonly right: number;
};
export type Output = { readonly parameter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knot: { type: "number" },
    left: { type: "number" },
    right: { type: "number" },
  },
  required: ["knot", "left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { parameter: { type: "number" } },
  required: ["parameter"],
} as const;
/** Resolve an affine segment parameter, preserving extrapolation outside the knot interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { knot, left, right } = request;
  const compute = (): Output => {
    H.domain(left !== right);
    return { parameter: (knot - left) / (right - left) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { knot: 3, left: 1, right: 5 },
  output: { parameter: 0.5 },
} satisfies ToolExample<Input, Output>;
export const affineKnotParameterTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "interpolation/affine-knot-parameter",
      title: "Affine Knot Parameter Tool",
      description:
        "Resolve an affine segment parameter, preserving extrapolation outside the knot interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          knot: { type: "number" },
          left: { type: "number" },
          right: { type: "number" },
        },
        required: ["knot", "left", "right"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { parameter: { type: "number" } },
        required: ["parameter"],
      },
      ports: {
        inputs: [
          {
            id: "knot",
            label: "Knot",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "left",
            label: "Left",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "right",
            label: "Right",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "parameter",
            label: "Parameter",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = affineKnotParameterTool.execute;
export default affineKnotParameterTool;
