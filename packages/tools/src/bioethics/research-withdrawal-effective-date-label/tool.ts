import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantCode: string;
  readonly effectiveDate: string;
  readonly asOfDate: string;
};
export type Output = { readonly effective: boolean; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantCode: { type: "string", maxLength: 8192 },
    effectiveDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["participantCode", "effectiveDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effective: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["effective", "label"],
} as const;
/** Label an explicit withdrawal effective date and compare it with an explicit as-of date, including the effective date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantCode, effectiveDate, asOfDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(participantCode.length > 0, "participantCode");
    const effectiveDateMs = namedDate(effectiveDate, "effectiveDate").getTime(),
      asOfMs = namedDate(asOfDate, "asOfDate").getTime();
    return {
      effective: asOfMs >= effectiveDateMs,
      label: participantCode + " withdrawal effective " + effectiveDate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantCode: "P-17",
    effectiveDate: "2026-10-10",
    asOfDate: "2026-10-12",
  },
  output: { effective: true, label: "P-17 withdrawal effective 2026-10-10" },
} satisfies ToolExample<Input, Output>;
export const researchWithdrawalEffectiveDateLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioethics/research-withdrawal-effective-date-label",
      title: "Research Withdrawal Effective Date Label Tool",
      description:
        "Label an explicit withdrawal effective date and compare it with an explicit as-of date, including the effective date.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          participantCode: { type: "string", maxLength: 8192 },
          effectiveDate: { type: "string", maxLength: 8192 },
          asOfDate: { type: "string", maxLength: 8192 },
        },
        required: ["participantCode", "effectiveDate", "asOfDate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effective: { type: "boolean" },
          label: { type: "string", maxLength: 8192 },
        },
        required: ["effective", "label"],
      },
      ports: {
        inputs: [
          {
            id: "participantCode",
            label: "Participant Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "effectiveDate",
            label: "Effective Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "asOfDate",
            label: "As Of Date",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "effective",
            label: "Effective",
            valueType: { type: "boolean" },
          },
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = researchWithdrawalEffectiveDateLabelTool.execute;
export default researchWithdrawalEffectiveDateLabelTool;
