import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedEndogenousValue: number;
  readonly firstStageFittedValue: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedEndogenousValue: { type: "number" },
    firstStageFittedValue: { type: "number" },
  },
  required: ["observedEndogenousValue", "firstStageFittedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Compute a supplied first-stage observation-minus-fitted residual without estimating instruments, identification or a regression. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedEndogenousValue, firstStageFittedValue } = request;
  const compute = (): Output => {
    return { residual: observedEndogenousValue - firstStageFittedValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedEndogenousValue: 12, firstStageFittedValue: 10 },
  output: { residual: 2 },
} satisfies ToolExample<Input, Output>;
export const instrumentalVariableFirstStageResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["econometrics", "economics"],
        keywords: ["econometrics", "economics"],
      },
      id: "econometrics/instrumental-variable-first-stage-residual",
      title: "Instrumental Variable First Stage Residual",
      description:
        "Compute a supplied first-stage observation-minus-fitted residual without estimating instruments, identification or a regression.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedEndogenousValue: { type: "number" },
          firstStageFittedValue: { type: "number" },
        },
        required: ["observedEndogenousValue", "firstStageFittedValue"],
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
            id: "observedEndogenousValue",
            label: "Observed Endogenous Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstStageFittedValue",
            label: "First Stage Fitted Value",
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
export const run = instrumentalVariableFirstStageResidualTool.execute;
export default instrumentalVariableFirstStageResidualTool;
