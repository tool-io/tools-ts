import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterRecordId: string;
  readonly parameterWording: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    parameterWording: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["waterRecordId", "parameterWording", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit source-water parameter and unit wording without interpreting water suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterRecordId, parameterWording, unitText } = request;
  const compute = (): Output => {
    H.domain(waterRecordId.length > 0, "waterRecordId");
    H.domain(parameterWording.length > 0, "parameterWording");
    H.domain(unitText.length > 0, "unitText");
    return {
      token: JSON.stringify([waterRecordId, parameterWording, unitText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    waterRecordId: "W17",
    parameterWording: "conductivity",
    unitText: "mS/cm",
  },
  output: { token: '["W17","conductivity","mS/cm"]' },
} satisfies ToolExample<Input, Output>;
export const hydroponicSourceWaterUnitBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["hydroponics", "agriculture"],
      keywords: ["hydroponics", "agriculture"],
    },
    id: "hydroponics/hydroponic-source-water-unit-basis",
    title: "Hydroponic Source Water Unit Basis",
    description:
      "Preserve explicit source-water parameter and unit wording without interpreting water suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        parameterWording: { type: "string", maxLength: 8192, minLength: 1 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["waterRecordId", "parameterWording", "unitText"],
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
          id: "waterRecordId",
          label: "Water Record Id",
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
export const run = hydroponicSourceWaterUnitBasisTool.execute;
export default hydroponicSourceWaterUnitBasisTool;
