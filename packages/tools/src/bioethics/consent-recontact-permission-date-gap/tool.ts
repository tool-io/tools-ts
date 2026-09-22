import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastPermissionDate: string;
  readonly referenceDate: string;
  readonly validityDays: number;
};
export type Output = {
  readonly ageDays: number;
  readonly remainingDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastPermissionDate: { type: "string", maxLength: 8192 },
    referenceDate: { type: "string", maxLength: 8192 },
    validityDays: { type: "integer", minimum: 0 },
  },
  required: ["lastPermissionDate", "referenceDate", "validityDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    remainingDays: { type: "integer" },
  },
  required: ["ageDays", "remainingDays"],
} as const;
/** Compare explicit civil dates with a supplied validity duration, with no policy chosen automatically. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastPermissionDate, referenceDate, validityDays } = request;
  const compute = (): Output => {
    H.integer(validityDays, 0);
    return {
      ageDays:
        (H.dateOnly(referenceDate).getTime() -
          H.dateOnly(lastPermissionDate).getTime()) /
        86400000,
      remainingDays:
        validityDays -
        (H.dateOnly(referenceDate).getTime() -
          H.dateOnly(lastPermissionDate).getTime()) /
          86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lastPermissionDate: "2026-10-01",
    referenceDate: "2026-10-26",
    validityDays: 30,
  },
  output: { ageDays: 25, remainingDays: 5 },
} satisfies ToolExample<Input, Output>;
export const consentRecontactPermissionDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/consent-recontact-permission-date-gap",
    title: "Consent Recontact Permission Date Gap Tool",
    description:
      "Compare explicit civil dates with a supplied validity duration, with no policy chosen automatically.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lastPermissionDate: { type: "string", maxLength: 8192 },
        referenceDate: { type: "string", maxLength: 8192 },
        validityDays: { type: "integer", minimum: 0 },
      },
      required: ["lastPermissionDate", "referenceDate", "validityDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "integer" },
        remainingDays: { type: "integer" },
      },
      required: ["ageDays", "remainingDays"],
    },
    ports: {
      inputs: [
        {
          id: "lastPermissionDate",
          label: "Last Permission Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceDate",
          label: "Reference Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "validityDays",
          label: "Validity Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
        {
          id: "remainingDays",
          label: "Remaining Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = consentRecontactPermissionDateGapTool.execute;
export default consentRecontactPermissionDateGapTool;
