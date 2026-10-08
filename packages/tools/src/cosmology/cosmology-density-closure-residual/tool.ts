import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly densityParameters: readonly number[];
  readonly targetSum: number;
};
export type Output = { readonly sum: number; readonly closureResidual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    densityParameters: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    targetSum: { type: "number" },
  },
  required: ["densityParameters", "targetSum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sum: { type: "number" }, closureResidual: { type: "number" } },
  required: ["sum", "closureResidual"],
} as const;
/** Compare explicitly supplied density-parameter components with an explicit closure target, allowing signed curvature components. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { densityParameters, targetSum } = request;
  const compute = (): Output => {
    const sum = densityParameters.reduce((a, b) => a + b, 0);
    return { sum, closureResidual: sum - targetSum };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { densityParameters: [0.3, 0.7], targetSum: 1 },
  output: { sum: 1, closureResidual: 0 },
} satisfies ToolExample<Input, Output>;
export const cosmologyDensityClosureResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cosmology", "physics"],
      keywords: ["cosmology", "physics"],
    },
    id: "cosmology/cosmology-density-closure-residual",
    title: "Cosmology Density Closure Residual",
    description:
      "Compare explicitly supplied density-parameter components with an explicit closure target, allowing signed curvature components.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        densityParameters: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        targetSum: { type: "number" },
      },
      required: ["densityParameters", "targetSum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sum: { type: "number" },
        closureResidual: { type: "number" },
      },
      required: ["sum", "closureResidual"],
    },
    ports: {
      inputs: [
        {
          id: "densityParameters",
          label: "Density Parameters",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "targetSum",
          label: "Target Sum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "sum", label: "Sum", valueType: { type: "number" } },
        {
          id: "closureResidual",
          label: "Closure Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cosmologyDensityClosureResidualTool.execute;
export default cosmologyDensityClosureResidualTool;
