import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modelId: string;
  readonly parameterName: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelId: { type: "string", maxLength: 8192, minLength: 1 },
    parameterName: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["modelId", "parameterName", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit Hill-model parameter by model and unit wording without fitting the parameter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modelId, parameterName, unitText } = request;
  const compute = (): Output => {
    H.domain(modelId.length > 0, "modelId");
    H.domain(parameterName.length > 0, "parameterName");
    H.domain(unitText.length > 0, "unitText");
    return { token: JSON.stringify([modelId, parameterName, unitText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { modelId: "M17", parameterName: "EC50", unitText: "nM" },
  output: { token: '["M17","EC50","nM"]' },
} satisfies ToolExample<Input, Output>;
export const pdHillParameterUnitTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["pharmacodynamics", "pharmacy"],
        keywords: ["pharmacodynamics", "pharmacy"],
      },
      id: "pharmacodynamics/pd-hill-parameter-unit",
      title: "PD Hill Parameter Unit",
      description:
        "Qualify an explicit Hill-model parameter by model and unit wording without fitting the parameter.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          modelId: { type: "string", maxLength: 8192, minLength: 1 },
          parameterName: { type: "string", maxLength: 8192, minLength: 1 },
          unitText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["modelId", "parameterName", "unitText"],
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
            id: "modelId",
            label: "Model Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "parameterName",
            label: "Parameter Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "unitText",
            label: "Unit Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = pdHillParameterUnitTool.execute;
export default pdHillParameterUnitTool;
