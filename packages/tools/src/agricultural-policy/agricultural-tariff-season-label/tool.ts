import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tariffRecordId: string;
  readonly seasonLabel: string;
  readonly ruleVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tariffRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    seasonLabel: { type: "string", maxLength: 8192, minLength: 1 },
    ruleVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["tariffRecordId", "seasonLabel", "ruleVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit agricultural tariff record by season and rule version without applying tariffs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tariffRecordId, seasonLabel, ruleVersion } = request;
  const compute = (): Output => {
    H.domain(tariffRecordId.length > 0, "tariffRecordId");
    H.domain(seasonLabel.length > 0, "seasonLabel");
    H.domain(ruleVersion.length > 0, "ruleVersion");
    return {
      token: JSON.stringify([tariffRecordId, seasonLabel, ruleVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tariffRecordId: "TAR17", seasonLabel: "2026-A", ruleVersion: "v2" },
  output: { token: '["TAR17","2026-A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const agriculturalTariffSeasonLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agricultural-policy", "agricultural policy", "agriculture"],
      keywords: ["agricultural policy", "agriculture"],
    },
    id: "agricultural-policy/agricultural-tariff-season-label",
    title: "Agricultural Tariff Season Label",
    description:
      "Qualify an explicit agricultural tariff record by season and rule version without applying tariffs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tariffRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        seasonLabel: { type: "string", maxLength: 8192, minLength: 1 },
        ruleVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["tariffRecordId", "seasonLabel", "ruleVersion"],
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
          id: "tariffRecordId",
          label: "Tariff Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "seasonLabel",
          label: "Season Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ruleVersion",
          label: "Rule Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = agriculturalTariffSeasonLabelTool.execute;
export default agriculturalTariffSeasonLabelTool;
