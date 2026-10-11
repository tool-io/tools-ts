import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scaleId: string;
  readonly version: string;
  readonly languageCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
    languageCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["scaleId", "version", "languageCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit psychiatric scale version and language code without scoring or validating a translation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scaleId, version, languageCode } = request;
  const compute = (): Output => {
    H.domain(scaleId.length > 0, "scaleId");
    H.domain(version.length > 0, "version");
    H.domain(languageCode.length > 0, "languageCode");
    return { token: JSON.stringify([scaleId, version, languageCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scaleId: "SC17", version: "v2", languageCode: "en" },
  output: { token: '["SC17","v2","en"]' },
} satisfies ToolExample<Input, Output>;
export const psychiatryScaleVersionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["psychiatry", "health and medicine"],
      keywords: ["psychiatry", "health and medicine"],
    },
    id: "psychiatry/psychiatry-scale-version-label",
    title: "Psychiatry Scale Version Label",
    description:
      "Qualify an explicit psychiatric scale version and language code without scoring or validating a translation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
        languageCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["scaleId", "version", "languageCode"],
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
          id: "scaleId",
          label: "Scale Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "languageCode",
          label: "Language Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = psychiatryScaleVersionLabelTool.execute;
export default psychiatryScaleVersionLabelTool;
