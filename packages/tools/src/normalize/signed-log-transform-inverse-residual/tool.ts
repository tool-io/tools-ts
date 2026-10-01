import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly original: number; readonly transformed: number };
export type Output = { readonly recovered: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { original: { type: "number" }, transformed: { type: "number" } },
  required: ["original", "transformed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recovered: { type: "number" }, residual: { type: "number" } },
  required: ["recovered", "residual"],
} as const;
/** Calculate signed log transform inverse residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { original, transformed } = request;
  const compute = (): Output => {
    const recovered =
      Math.sign(transformed) * Math.expm1(Math.abs(transformed));
    return { recovered, residual: original - recovered };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { original: 3, transformed: 1.3862943611198906 },
  output: { recovered: 3, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const signedLogTransformInverseResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/signed-log-transform-inverse-residual",
    title: "Signed Log Transform Inverse Residual Tool",
    description:
      "Calculate signed log transform inverse residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        original: { type: "number" },
        transformed: { type: "number" },
      },
      required: ["original", "transformed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recovered: { type: "number" },
        residual: { type: "number" },
      },
      required: ["recovered", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "original",
          label: "Original",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transformed",
          label: "Transformed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "recovered", label: "Recovered", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = signedLogTransformInverseResidualTool.execute;
export default signedLogTransformInverseResidualTool;
