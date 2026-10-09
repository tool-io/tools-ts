import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceMonth: string;
  readonly pensionStartMonth: string;
};
export type Output = { readonly signedMonths: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceMonth: { type: "string", maxLength: 8192 },
    pensionStartMonth: { type: "string", maxLength: 8192 },
  },
  required: ["referenceMonth", "pensionStartMonth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedMonths: { type: "integer" } },
  required: ["signedMonths"],
} as const;
/** Calculate signed calendar-month distance between explicit YYYY-MM study reference and pension start months without benefit eligibility rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceMonth, pensionStartMonth } = request;
  const compute = (): Output => {
    return (() => {
      const pattern = /^\d{4}-(?:0[1-9]|1[0-2])(?![\s\S])/;
      H.domain(pattern.test(referenceMonth), "referenceMonth");
      H.domain(pattern.test(pensionStartMonth), "pensionStartMonth");
      const index = (value: string) =>
        Number(value.slice(0, 4)) * 12 + Number(value.slice(5, 7)) - 1;
      return { signedMonths: index(pensionStartMonth) - index(referenceMonth) };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceMonth: "2026-01", pensionStartMonth: "2026-04" },
  output: { signedMonths: 3 },
} satisfies ToolExample<Input, Output>;
export const retirementStudyPensionStartMonthGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/retirement-study-pension-start-month-gap",
      title: "Retirement Study Pension Start Month Gap Tool",
      description:
        "Calculate signed calendar-month distance between explicit YYYY-MM study reference and pension start months without benefit eligibility rules.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceMonth: { type: "string", maxLength: 8192 },
          pensionStartMonth: { type: "string", maxLength: 8192 },
        },
        required: ["referenceMonth", "pensionStartMonth"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedMonths: { type: "integer" } },
        required: ["signedMonths"],
      },
      ports: {
        inputs: [
          {
            id: "referenceMonth",
            label: "Reference Month",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "pensionStartMonth",
            label: "Pension Start Month",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "signedMonths",
            label: "Signed Months",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = retirementStudyPensionStartMonthGapTool.execute;
export default retirementStudyPensionStartMonthGapTool;
