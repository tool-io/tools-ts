import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scaleCode: string;
  readonly itemCode: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleCode: { type: "string", maxLength: 8192, minLength: 1 },
    itemCode: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["scaleCode", "itemCode", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a psychological scale item by an explicit version without scoring or validating a scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scaleCode, itemCode, version } = request;
  const compute = (): Output => {
    H.domain(scaleCode.length > 0, "scaleCode");
    H.domain(itemCode.length > 0, "itemCode");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([scaleCode, itemCode, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scaleCode: "SC17", itemCode: "Q3", version: "v2" },
  output: { token: '["SC17","Q3","v2"]' },
} satisfies ToolExample<Input, Output>;
export const psychologicalScaleItemVersionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "experimental-psychology",
        "experimental psychology",
        "psychology",
      ],
      keywords: ["experimental psychology", "psychology"],
    },
    id: "experimental-psychology/psychological-scale-item-version",
    title: "Psychological Scale Item Version",
    description:
      "Qualify a psychological scale item by an explicit version without scoring or validating a scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleCode: { type: "string", maxLength: 8192, minLength: 1 },
        itemCode: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["scaleCode", "itemCode", "version"],
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
          id: "scaleCode",
          label: "Scale Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "itemCode",
          label: "Item Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = psychologicalScaleItemVersionTool.execute;
export default psychologicalScaleItemVersionTool;
