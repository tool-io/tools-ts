import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly extinction: number;
  readonly contrastThreshold: number;
};
export type Output = { readonly visibility: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extinction: { type: "number", exclusiveMinimum: 0 },
    contrastThreshold: {
      type: "number",
      exclusiveMinimum: 0,
      exclusiveMaximum: 1,
    },
  },
  required: ["extinction", "contrastThreshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { visibility: { type: "number" } },
  required: ["visibility"],
} as const;
/** Apply the homogeneous exponential-contrast model using an explicit detection threshold, without selecting a visibility standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { extinction, contrastThreshold } = request;
  const compute = (): Output => {
    H.positive(extinction);
    H.domain(contrastThreshold > 0 && contrastThreshold < 1);
    return { visibility: -Math.log(contrastThreshold) / extinction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { extinction: 0.01, contrastThreshold: 0.05 },
  output: { visibility: 299.57322735539907 },
} satisfies ToolExample<Input, Output>;
export const visibilityExtinctionSuppliedCoefficientTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/visibility-extinction-supplied-coefficient",
      title: "Visibility Extinction Supplied Coefficient Tool",
      description:
        "Apply the homogeneous exponential-contrast model using an explicit detection threshold, without selecting a visibility standard.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          extinction: { type: "number", exclusiveMinimum: 0 },
          contrastThreshold: {
            type: "number",
            exclusiveMinimum: 0,
            exclusiveMaximum: 1,
          },
        },
        required: ["extinction", "contrastThreshold"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { visibility: { type: "number" } },
        required: ["visibility"],
      },
      ports: {
        inputs: [
          {
            id: "extinction",
            label: "Extinction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "contrastThreshold",
            label: "Contrast Threshold",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "visibility",
            label: "Visibility",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = visibilityExtinctionSuppliedCoefficientTool.execute;
export default visibilityExtinctionSuppliedCoefficientTool;
