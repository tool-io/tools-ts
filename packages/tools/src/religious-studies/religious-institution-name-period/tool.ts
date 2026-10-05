import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly institutionName: string;
  readonly startYear: number;
  readonly endYear: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    institutionName: { type: "string", maxLength: 8192 },
    startYear: { type: "integer", minimum: -100000, maximum: 9999 },
    endYear: { type: "integer", maximum: 9999 },
  },
  required: ["institutionName", "startYear", "endYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a recorded institution name with an explicit historical year interval without asserting institutional continuity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { institutionName, startYear, endYear } = request;
  const compute = (): Output => {
    H.domain(institutionName.length > 0, "institutionName");
    (H.domain(
      Number.isSafeInteger(startYear) &&
        startYear >= -100000 &&
        startYear <= 9999,
      "startYear",
    ),
      startYear);
    (H.domain(
      Number.isSafeInteger(endYear) && endYear >= startYear && endYear <= 9999,
      "endYear",
    ),
      endYear);
    return { label: institutionName + " [" + startYear + "–" + endYear + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { institutionName: "Institution A", startYear: 1900, endYear: 1950 },
  output: { label: "Institution A [1900–1950]" },
} satisfies ToolExample<Input, Output>;
export const religiousInstitutionNamePeriodTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/religious-institution-name-period",
    title: "Religious Institution Name Period Tool",
    description:
      "Label a recorded institution name with an explicit historical year interval without asserting institutional continuity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        institutionName: { type: "string", maxLength: 8192 },
        startYear: { type: "integer", minimum: -100000, maximum: 9999 },
        endYear: { type: "integer", maximum: 9999 },
      },
      required: ["institutionName", "startYear", "endYear"],
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
          id: "institutionName",
          label: "Institution Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "startYear",
          label: "Start Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endYear",
          label: "End Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = religiousInstitutionNamePeriodTool.execute;
export default religiousInstitutionNamePeriodTool;
