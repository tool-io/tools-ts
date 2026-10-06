import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly farmId: string;
  readonly cropCode: string;
  readonly seasonLabel: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    farmId: { type: "string", maxLength: 8192, minLength: 1 },
    cropCode: { type: "string", maxLength: 8192, minLength: 1 },
    seasonLabel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["farmId", "cropCode", "seasonLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous key from explicit farm, crop, and season labels without inferring cropping history. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { farmId, cropCode, seasonLabel } = request;
  const compute = (): Output => {
    H.domain(farmId.length > 0, "farmId");
    H.domain(cropCode.length > 0, "cropCode");
    H.domain(seasonLabel.length > 0, "seasonLabel");
    return { token: JSON.stringify([farmId, cropCode, seasonLabel]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { farmId: "FARM17", cropCode: "CROP2", seasonLabel: "2026-A" },
  output: { token: '["FARM17","CROP2","2026-A"]' },
} satisfies ToolExample<Input, Output>;
export const farmLogCropSeasonKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroinformatics", "agriculture"],
      keywords: ["agroinformatics", "agriculture"],
    },
    id: "agroinformatics/farm-log-crop-season-key",
    title: "Farm Log Crop Season Key",
    description:
      "Build an unambiguous key from explicit farm, crop, and season labels without inferring cropping history.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        farmId: { type: "string", maxLength: 8192, minLength: 1 },
        cropCode: { type: "string", maxLength: 8192, minLength: 1 },
        seasonLabel: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["farmId", "cropCode", "seasonLabel"],
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
          id: "farmId",
          label: "Farm Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cropCode",
          label: "Crop Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "seasonLabel",
          label: "Season Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = farmLogCropSeasonKeyTool.execute;
export default farmLogCropSeasonKeyTool;
