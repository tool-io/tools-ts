import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftDerivative: number;
  readonly rightDerivative: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftDerivative: { type: "number" },
    rightDerivative: { type: "number" },
  },
  required: ["leftDerivative", "rightDerivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit left derivative from right derivative without asserting differentiability from approximate values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftDerivative, rightDerivative } = request;
  const compute = (): Output => {
    return { signedGap: rightDerivative - leftDerivative };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftDerivative: 12, rightDerivative: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const oneSidedDerivativeAgreementResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["calculus", "mathematics"],
        keywords: ["calculus", "mathematics"],
      },
      id: "calculus/one-sided-derivative-agreement-residual",
      title: "One Sided Derivative Agreement Residual",
      description:
        "Subtract explicit left derivative from right derivative without asserting differentiability from approximate values.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leftDerivative: { type: "number" },
          rightDerivative: { type: "number" },
        },
        required: ["leftDerivative", "rightDerivative"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "leftDerivative",
            label: "Left Derivative",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rightDerivative",
            label: "Right Derivative",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = oneSidedDerivativeAgreementResidualTool.execute;
export default oneSidedDerivativeAgreementResidualTool;
