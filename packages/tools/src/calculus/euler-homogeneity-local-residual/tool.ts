import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly point: readonly number[];
  readonly gradient: readonly number[];
  readonly degree: number;
  readonly value: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    point: { type: "array", maxItems: 256, items: { type: "number" } },
    gradient: { type: "array", maxItems: 256, items: { type: "number" } },
    degree: { type: "number" },
    value: { type: "number" },
  },
  required: ["point", "gradient", "degree", "value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Calculate euler homogeneity local residual from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { point, gradient, degree, value } = input;
  const compute = (): Output => {
    H.sameLength(point, gradient);
    return { residual: H.dot(point, gradient) - degree * value };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: [2, 3], gradient: [4, 6], degree: 2, value: 13 },
  output: { residual: 0 },
} satisfies ToolExample<Input, Output>;
export const eulerHomogeneityLocalResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/euler-homogeneity-local-residual",
    title: "Euler Homogeneity Local Residual Tool",
    description:
      "Calculate euler homogeneity local residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        point: { type: "array", maxItems: 256, items: { type: "number" } },
        gradient: { type: "array", maxItems: 256, items: { type: "number" } },
        degree: { type: "number" },
        value: { type: "number" },
      },
      required: ["point", "gradient", "degree", "value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residual: { type: "number" } },
      required: ["residual"],
    },
    ports: {
      inputs: [
        {
          id: "point",
          label: "Point",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "gradient",
          label: "Gradient",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "degree",
          label: "Degree",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eulerHomogeneityLocalResidualTool.execute;
export default eulerHomogeneityLocalResidualTool;
