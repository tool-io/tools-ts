import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly center: number;
  readonly weight: number;
};
export type Output = { readonly weightedResidual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    center: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["value", "center", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedResidual: { type: "number" } },
  required: ["weightedResidual"],
} as const;
/** Calculate weighted mean centering term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, center, weight } = request;
  const compute = (): Output => {
    H.domain(weight >= 0);
    return { weightedResidual: weight * (value - center) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 8, center: 5, weight: 2 },
  output: { weightedResidual: 6 },
} satisfies ToolExample<Input, Output>;
export const weightedMeanCenteringTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/weighted-mean-centering-term",
    title: "Weighted Mean Centering Term Tool",
    description:
      "Calculate weighted mean centering term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        center: { type: "number" },
        weight: { type: "number", minimum: 0 },
      },
      required: ["value", "center", "weight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedResidual: { type: "number" } },
      required: ["weightedResidual"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "center",
          label: "Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedResidual",
          label: "Weighted Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = weightedMeanCenteringTermTool.execute;
export default weightedMeanCenteringTermTool;
