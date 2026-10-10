import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coefficientCode: string;
  readonly referenceMethod: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficientCode: { type: "string", maxLength: 8192, minLength: 1 },
    referenceMethod: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["coefficientCode", "referenceMethod", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly supplied evapotranspiration coefficient reference without providing a crop or reference coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coefficientCode, referenceMethod, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(coefficientCode.length > 0, "coefficientCode");
    H.domain(referenceMethod.length > 0, "referenceMethod");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return {
      token: JSON.stringify([coefficientCode, referenceMethod, sourceVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coefficientCode: "K17",
    referenceMethod: "Method A",
    sourceVersion: "v2",
  },
  output: { token: '["K17","Method A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const referenceEtCoefficientLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["hydrometeorology", "earth and environmental sciences"],
      keywords: ["hydrometeorology", "earth and environmental sciences"],
    },
    id: "hydrometeorology/reference-et-coefficient-label",
    title: "Reference ET Coefficient Label",
    description:
      "Qualify an explicitly supplied evapotranspiration coefficient reference without providing a crop or reference coefficient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficientCode: { type: "string", maxLength: 8192, minLength: 1 },
        referenceMethod: { type: "string", maxLength: 8192, minLength: 1 },
        sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["coefficientCode", "referenceMethod", "sourceVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "coefficientCode",
          label: "Coefficient Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceMethod",
          label: "Reference Method",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceVersion",
          label: "Source Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = referenceEtCoefficientLabelTool.execute;
export default referenceEtCoefficientLabelTool;
