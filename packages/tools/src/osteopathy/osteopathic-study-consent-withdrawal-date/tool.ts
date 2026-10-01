import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryDay: number;
  readonly assessmentDay: number;
  readonly withdrawalDay: number;
  readonly withdrawn: boolean;
  readonly inclusiveWithdrawal: boolean;
};
export type Output = {
  readonly sinceEntry: number;
  readonly afterWithdrawal: boolean;
  readonly eligible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryDay: { type: "integer" },
    assessmentDay: { type: "integer" },
    withdrawalDay: { type: "integer" },
    withdrawn: { type: "boolean" },
    inclusiveWithdrawal: { type: "boolean" },
  },
  required: [
    "entryDay",
    "assessmentDay",
    "withdrawalDay",
    "withdrawn",
    "inclusiveWithdrawal",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sinceEntry: { type: "integer" },
    afterWithdrawal: { type: "boolean" },
    eligible: { type: "boolean" },
  },
  required: ["sinceEntry", "afterWithdrawal", "eligible"],
} as const;
/** Calculate osteopathic study consent withdrawal date from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    entryDay,
    assessmentDay,
    withdrawalDay,
    withdrawn,
    inclusiveWithdrawal,
  } = request;
  const compute = (): Output => {
    H.domain(!withdrawn || withdrawalDay >= entryDay);
    return {
      sinceEntry: assessmentDay - entryDay,
      afterWithdrawal:
        withdrawn &&
        (inclusiveWithdrawal
          ? assessmentDay >= withdrawalDay
          : assessmentDay > withdrawalDay),
      eligible:
        assessmentDay >= entryDay &&
        !(
          withdrawn &&
          (inclusiveWithdrawal
            ? assessmentDay >= withdrawalDay
            : assessmentDay > withdrawalDay)
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entryDay: 100,
    assessmentDay: 110,
    withdrawalDay: 110,
    withdrawn: true,
    inclusiveWithdrawal: true,
  },
  output: { sinceEntry: 10, afterWithdrawal: true, eligible: false },
} satisfies ToolExample<Input, Output>;
export const osteopathicStudyConsentWithdrawalDateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "osteopathy/osteopathic-study-consent-withdrawal-date",
      title: "Osteopathic Study Consent Withdrawal Date Tool",
      description:
        "Calculate osteopathic study consent withdrawal date from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          entryDay: { type: "integer" },
          assessmentDay: { type: "integer" },
          withdrawalDay: { type: "integer" },
          withdrawn: { type: "boolean" },
          inclusiveWithdrawal: { type: "boolean" },
        },
        required: [
          "entryDay",
          "assessmentDay",
          "withdrawalDay",
          "withdrawn",
          "inclusiveWithdrawal",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sinceEntry: { type: "integer" },
          afterWithdrawal: { type: "boolean" },
          eligible: { type: "boolean" },
        },
        required: ["sinceEntry", "afterWithdrawal", "eligible"],
      },
      ports: {
        inputs: [
          {
            id: "entryDay",
            label: "Entry Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "assessmentDay",
            label: "Assessment Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "withdrawalDay",
            label: "Withdrawal Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "withdrawn",
            label: "Withdrawn",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "inclusiveWithdrawal",
            label: "Inclusive Withdrawal",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "sinceEntry",
            label: "Since Entry",
            valueType: { type: "integer" },
          },
          {
            id: "afterWithdrawal",
            label: "After Withdrawal",
            valueType: { type: "boolean" },
          },
          { id: "eligible", label: "Eligible", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = osteopathicStudyConsentWithdrawalDateTool.execute;
export default osteopathicStudyConsentWithdrawalDateTool;
