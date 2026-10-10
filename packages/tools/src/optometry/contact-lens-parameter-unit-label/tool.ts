import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly parameterWording: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    parameterWording: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "parameterWording", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record supplied contact-lens parameter and unit wording without choosing a lens parameter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, parameterWording, unitText } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(parameterWording.length > 0, "parameterWording");
    H.domain(unitText.length > 0, "unitText");
    return { token: JSON.stringify([recordId, parameterWording, unitText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "CL17", parameterWording: "base curve", unitText: "mm" },
  output: { token: '["CL17","base curve","mm"]' },
} satisfies ToolExample<Input, Output>;
export const contactLensParameterUnitLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["optometry", "health and medicine"],
      keywords: ["optometry", "health and medicine"],
    },
    id: "optometry/contact-lens-parameter-unit-label",
    title: "Contact Lens Parameter Unit Label",
    description:
      "Record supplied contact-lens parameter and unit wording without choosing a lens parameter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        parameterWording: { type: "string", maxLength: 8192, minLength: 1 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "parameterWording", "unitText"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parameterWording",
          label: "Parameter Wording",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = contactLensParameterUnitLabelTool.execute;
export default contactLensParameterUnitLabelTool;
