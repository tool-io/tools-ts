import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly parameter: number;
};
export type Output = {
  readonly tangent: readonly number[];
  readonly normal: readonly number[];
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number", exclusiveMinimum: 0 },
    b: { type: "number", exclusiveMinimum: 0 },
    parameter: { type: "number" },
  },
  required: ["a", "b", "parameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tangent: { type: "array", maxItems: 256, items: { type: "number" } },
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
    residual: { type: "number" },
  },
  required: ["tangent", "normal", "residual"],
} as const;
/** Calculate ellipse normal tangent orthogonality residual from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b, parameter } = input;
  const compute = (): Output => {
    H.positive(a);
    H.positive(b);
    const s = Math.sin(parameter),
      c = Math.cos(parameter),
      tangent = [-a * s, b * c],
      normal = [c / a, s / b];
    return { tangent, normal, residual: H.dot(tangent, normal) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 3, b: 2, parameter: 0 },
  output: { tangent: [0, 2], normal: [0.3333333333333333, 0], residual: 0 },
} satisfies ToolExample<Input, Output>;
export const ellipseNormalTangentOrthogonalityResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geometry/ellipse-normal-tangent-orthogonality-residual",
      title: "Ellipse Normal Tangent Orthogonality Residual Tool",
      description:
        "Calculate ellipse normal tangent orthogonality residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          a: { type: "number", exclusiveMinimum: 0 },
          b: { type: "number", exclusiveMinimum: 0 },
          parameter: { type: "number" },
        },
        required: ["a", "b", "parameter"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tangent: { type: "array", maxItems: 256, items: { type: "number" } },
          normal: { type: "array", maxItems: 256, items: { type: "number" } },
          residual: { type: "number" },
        },
        required: ["tangent", "normal", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "a",
            label: "A",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "b",
            label: "B",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "parameter",
            label: "Parameter",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "tangent",
            label: "Tangent",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "normal",
            label: "Normal",
            valueType: { type: "list", items: { type: "number" } },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = ellipseNormalTangentOrthogonalityResidualTool.execute;
export default ellipseNormalTangentOrthogonalityResidualTool;
