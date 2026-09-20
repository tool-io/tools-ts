import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number };
export type Output = {
  readonly sigmoidDerivative: number;
  readonly logitDerivative: number;
  readonly sign: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
  },
  required: ["probability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sigmoidDerivative: { type: "number" },
    logitDerivative: { type: "number" },
    sign: { type: "integer" },
  },
  required: ["sigmoidDerivative", "logitDerivative", "sign"],
} as const;
/** Calculate sigmoid logit jacobian sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability } = request;
  const compute = (): Output => {
    H.domain(probability > 0 && probability < 1);
    return {
      sigmoidDerivative: probability * (1 - probability),
      logitDerivative: 1 / (probability * (1 - probability)),
      sign: 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.5 },
  output: { sigmoidDerivative: 0.25, logitDerivative: 4, sign: 1 },
} satisfies ToolExample<Input, Output>;
export const sigmoidLogitJacobianSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/sigmoid-logit-jacobian-sign",
    title: "Sigmoid Logit Jacobian Sign Tool",
    description:
      "Calculate sigmoid logit jacobian sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: {
          type: "number",
          exclusiveMinimum: 0,
          exclusiveMaximum: 1,
        },
      },
      required: ["probability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sigmoidDerivative: { type: "number" },
        logitDerivative: { type: "number" },
        sign: { type: "integer" },
      },
      required: ["sigmoidDerivative", "logitDerivative", "sign"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "sigmoidDerivative",
          label: "Sigmoid Derivative",
          valueType: { type: "number" },
        },
        {
          id: "logitDerivative",
          label: "Logit Derivative",
          valueType: { type: "number" },
        },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = sigmoidLogitJacobianSignTool.execute;
export default sigmoidLogitJacobianSignTool;
