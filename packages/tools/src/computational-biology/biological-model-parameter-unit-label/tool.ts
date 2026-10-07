import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parameterId: string;
  readonly parameterValue: number;
  readonly unit: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parameterId: { type: "string", maxLength: 8192, minLength: 1 },
    parameterValue: { type: "number" },
    unit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["parameterId", "parameterValue", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied biological-model parameter value and explicit unit without validating a biological model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parameterId, parameterValue, unit } = request;
  const compute = (): Output => {
    H.domain(parameterId.length > 0 && unit.length > 0, "parameterId");
    return { label: parameterId + " = " + parameterValue + " " + unit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parameterId: "k_decay", parameterValue: 0.2, unit: "1/h" },
  output: { label: "k_decay = 0.2 1/h" },
} satisfies ToolExample<Input, Output>;
export const biologicalModelParameterUnitLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-biology", "computational biology", "biology"],
      keywords: ["computational biology", "biology"],
    },
    id: "computational-biology/biological-model-parameter-unit-label",
    title: "Biological Model Parameter Unit Label",
    description:
      "Label a supplied biological-model parameter value and explicit unit without validating a biological model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parameterId: { type: "string", maxLength: 8192, minLength: 1 },
        parameterValue: { type: "number" },
        unit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["parameterId", "parameterValue", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "parameterId",
          label: "Parameter Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parameterValue",
          label: "Parameter Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biologicalModelParameterUnitLabelTool.execute;
export default biologicalModelParameterUnitLabelTool;
