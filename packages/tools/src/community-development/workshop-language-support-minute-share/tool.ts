import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly languageSupportMinutes: number;
  readonly workshopMinutes: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    languageSupportMinutes: { type: "number", minimum: 0 },
    workshopMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["languageSupportMinutes", "workshopMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate explicitly recorded workshop language-support time share without judging access adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { languageSupportMinutes, workshopMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(workshopMinutes) && workshopMinutes > 0,
      "workshopMinutes",
    ),
      workshopMinutes);
    H.domain(
      languageSupportMinutes >= 0 && languageSupportMinutes <= workshopMinutes,
      "languageSupportMinutes",
    );
    return {
      fraction: languageSupportMinutes / workshopMinutes,
      remainder: workshopMinutes - languageSupportMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { languageSupportMinutes: 30, workshopMinutes: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const workshopLanguageSupportMinuteShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/workshop-language-support-minute-share",
    title: "Workshop Language Support Minute Share",
    description:
      "Calculate explicitly recorded workshop language-support time share without judging access adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        languageSupportMinutes: { type: "number", minimum: 0 },
        workshopMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["languageSupportMinutes", "workshopMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "languageSupportMinutes",
          label: "Language Support Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "workshopMinutes",
          label: "Workshop Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = workshopLanguageSupportMinuteShareTool.execute;
export default workshopLanguageSupportMinuteShareTool;
