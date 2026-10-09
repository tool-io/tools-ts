import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordCode: string;
  readonly tenureWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordCode: { type: "string", maxLength: 8192, minLength: 1 },
    tenureWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordCode", "tenureWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record supplied housing-tenure wording and source without assigning tenure or legal ownership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordCode, tenureWording, source } = request;
  const compute = (): Output => {
    H.domain(recordCode.length > 0, "recordCode");
    H.domain(tenureWording.length > 0, "tenureWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([recordCode, tenureWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordCode: "H17",
    tenureWording: "owner-occupied",
    source: "Survey A",
  },
  output: { token: '["H17","owner-occupied","Survey A"]' },
} satisfies ToolExample<Input, Output>;
export const laterlifeHousingTenureLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gerontology", "health and medicine"],
      keywords: ["gerontology", "health and medicine"],
    },
    id: "gerontology/later-life-housing-tenure-label",
    title: "Later Life Housing Tenure Label",
    description:
      "Record supplied housing-tenure wording and source without assigning tenure or legal ownership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordCode: { type: "string", maxLength: 8192, minLength: 1 },
        tenureWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordCode", "tenureWording", "source"],
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
          id: "recordCode",
          label: "Record Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "tenureWording",
          label: "Tenure Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = laterlifeHousingTenureLabelTool.execute;
export default laterlifeHousingTenureLabelTool;
