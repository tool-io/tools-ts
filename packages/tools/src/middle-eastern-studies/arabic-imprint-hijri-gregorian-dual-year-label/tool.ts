import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hijriYear: number;
  readonly gregorianYear: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hijriYear: { type: "integer", minimum: 1 },
    gregorianYear: { type: "integer", minimum: 1, maximum: 9999 },
  },
  required: ["hijriYear", "gregorianYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format two explicitly recorded imprint years without calculating or asserting exact calendar equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hijriYear, gregorianYear } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(hijriYear) &&
        hijriYear >= 1 &&
        hijriYear <= Number.MAX_SAFE_INTEGER,
      "hijriYear",
    ),
      hijriYear);
    (H.domain(
      Number.isSafeInteger(gregorianYear) &&
        gregorianYear >= 1 &&
        gregorianYear <= 9999,
      "gregorianYear",
    ),
      gregorianYear);
    return { label: hijriYear + " AH / " + gregorianYear + " CE" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hijriYear: 1447, gregorianYear: 2026 },
  output: { label: "1447 AH / 2026 CE" },
} satisfies ToolExample<Input, Output>;
export const arabicImprintHijriGregorianDualYearLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "middle-eastern-studies/arabic-imprint-hijri-gregorian-dual-year-label",
      title: "Arabic Imprint Hijri Gregorian Dual Year Label Tool",
      description:
        "Format two explicitly recorded imprint years without calculating or asserting exact calendar equivalence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hijriYear: { type: "integer", minimum: 1 },
          gregorianYear: { type: "integer", minimum: 1, maximum: 9999 },
        },
        required: ["hijriYear", "gregorianYear"],
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
            id: "hijriYear",
            label: "Hijri Year",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "gregorianYear",
            label: "Gregorian Year",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = arabicImprintHijriGregorianDualYearLabelTool.execute;
export default arabicImprintHijriGregorianDualYearLabelTool;
