import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldDue: string;
  readonly newDue: string;
  readonly renewalDate: string;
};
export type Output = {
  readonly extensionDays: number;
  readonly renewedRemainingDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldDue: { type: "string", maxLength: 8192 },
    newDue: { type: "string", maxLength: 8192 },
    renewalDate: { type: "string", maxLength: 8192 },
  },
  required: ["oldDue", "newDue", "renewalDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extensionDays: { type: "integer" },
    renewedRemainingDays: { type: "integer" },
  },
  required: ["extensionDays", "renewedRemainingDays"],
} as const;
/** Compare supplied civil due dates without selecting lending or renewal eligibility policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldDue, newDue, renewalDate } = request;
  const compute = (): Output => {
    return {
      extensionDays:
        (H.dateOnly(newDue).getTime() - H.dateOnly(oldDue).getTime()) /
        86400000,
      renewedRemainingDays:
        (H.dateOnly(newDue).getTime() - H.dateOnly(renewalDate).getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oldDue: "2026-10-26",
    newDue: "2026-11-09",
    renewalDate: "2026-10-25",
  },
  output: { extensionDays: 14, renewedRemainingDays: 15 },
} satisfies ToolExample<Input, Output>;
export const lendingRenewalDueDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/lending-renewal-due-date-gap",
    title: "Lending Renewal Due Date Gap Tool",
    description:
      "Compare supplied civil due dates without selecting lending or renewal eligibility policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldDue: { type: "string", maxLength: 8192 },
        newDue: { type: "string", maxLength: 8192 },
        renewalDate: { type: "string", maxLength: 8192 },
      },
      required: ["oldDue", "newDue", "renewalDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extensionDays: { type: "integer" },
        renewedRemainingDays: { type: "integer" },
      },
      required: ["extensionDays", "renewedRemainingDays"],
    },
    ports: {
      inputs: [
        {
          id: "oldDue",
          label: "Old Due",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "newDue",
          label: "New Due",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "renewalDate",
          label: "Renewal Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "extensionDays",
          label: "Extension Days",
          valueType: { type: "integer" },
        },
        {
          id: "renewedRemainingDays",
          label: "Renewed Remaining Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = lendingRenewalDueDateGapTool.execute;
export default lendingRenewalDueDateGapTool;
