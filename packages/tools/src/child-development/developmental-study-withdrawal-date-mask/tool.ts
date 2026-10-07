import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly withdrawalDate: string;
  readonly discloseDate: boolean;
  readonly suppliedMask: string;
};
export type Output = { readonly displayText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withdrawalDate: { type: "string", maxLength: 8192 },
    discloseDate: { type: "boolean" },
    suppliedMask: { type: "string", maxLength: 8192 },
  },
  required: ["withdrawalDate", "discloseDate", "suppliedMask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayText: { type: "string", maxLength: 8192 } },
  required: ["displayText"],
} as const;
/** Choose an explicit study withdrawal date or caller-supplied mask under a disclosure flag without claiming anonymization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { withdrawalDate, discloseDate, suppliedMask } = request;
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
    namedDate(withdrawalDate, "withdrawalDate");
    return { displayText: discloseDate ? withdrawalDate : suppliedMask };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    withdrawalDate: "2026-10-28",
    discloseDate: false,
    suppliedMask: "withheld",
  },
  output: { displayText: "withheld" },
} satisfies ToolExample<Input, Output>;
export const developmentalStudyWithdrawalDateMaskTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["child-development", "child development", "psychology"],
        keywords: ["child development", "psychology"],
      },
      id: "child-development/developmental-study-withdrawal-date-mask",
      title: "Developmental Study Withdrawal Date Mask",
      description:
        "Choose an explicit study withdrawal date or caller-supplied mask under a disclosure flag without claiming anonymization.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          withdrawalDate: { type: "string", maxLength: 8192 },
          discloseDate: { type: "boolean" },
          suppliedMask: { type: "string", maxLength: 8192 },
        },
        required: ["withdrawalDate", "discloseDate", "suppliedMask"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { displayText: { type: "string", maxLength: 8192 } },
        required: ["displayText"],
      },
      ports: {
        inputs: [
          {
            id: "withdrawalDate",
            label: "Withdrawal Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "discloseDate",
            label: "Disclose Date",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "suppliedMask",
            label: "Supplied Mask",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "displayText",
            label: "Display Text",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = developmentalStudyWithdrawalDateMaskTool.execute;
export default developmentalStudyWithdrawalDateMaskTool;
