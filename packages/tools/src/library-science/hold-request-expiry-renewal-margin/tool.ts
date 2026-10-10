import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asOfDate: string;
  readonly originalExpiryDate: string;
  readonly renewalDays: number;
};
export type Output = {
  readonly renewedExpiryDate: string;
  readonly signedDaysRemaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asOfDate: { type: "string", maxLength: 8192 },
    originalExpiryDate: { type: "string", maxLength: 8192 },
    renewalDays: { type: "integer", minimum: 0 },
  },
  required: ["asOfDate", "originalExpiryDate", "renewalDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    renewedExpiryDate: { type: "string", maxLength: 8192 },
    signedDaysRemaining: { type: "integer" },
  },
  required: ["renewedExpiryDate", "signedDaysRemaining"],
} as const;
/** Apply an explicit nonnegative calendar-day renewal to a recorded hold expiry and compare with a supplied date without selecting circulation policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asOfDate, originalExpiryDate, renewalDays } = request;
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
    (H.domain(
      Number.isSafeInteger(renewalDays) &&
        renewalDays >= 0 &&
        renewalDays <= Number.MAX_SAFE_INTEGER,
      "renewalDays",
    ),
      renewalDays);
    return (() => {
      const d = namedDate(originalExpiryDate, "originalExpiryDate");
      d.setUTCDate(d.getUTCDate() + renewalDays);
      H.domain(
        Number.isFinite(d.getTime()) &&
          d.getUTCFullYear() >= 0 &&
          d.getUTCFullYear() <= 9999,
        "renewalDays",
      );
      return {
        renewedExpiryDate: d.toISOString().slice(0, 10),
        signedDaysRemaining:
          (d.getTime() - namedDate(asOfDate, "asOfDate").getTime()) / 86400000,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    asOfDate: "2026-11-01",
    originalExpiryDate: "2026-11-03",
    renewalDays: 2,
  },
  output: { renewedExpiryDate: "2026-11-05", signedDaysRemaining: 4 },
} satisfies ToolExample<Input, Output>;
export const holdRequestExpiryRenewalMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "library-science",
        "library science",
        "information and language sciences",
      ],
      keywords: ["library science", "information and language sciences"],
    },
    id: "library-science/hold-request-expiry-renewal-margin",
    title: "Hold Request Expiry Renewal Margin",
    description:
      "Apply an explicit nonnegative calendar-day renewal to a recorded hold expiry and compare with a supplied date without selecting circulation policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asOfDate: { type: "string", maxLength: 8192 },
        originalExpiryDate: { type: "string", maxLength: 8192 },
        renewalDays: { type: "integer", minimum: 0 },
      },
      required: ["asOfDate", "originalExpiryDate", "renewalDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        renewedExpiryDate: { type: "string", maxLength: 8192 },
        signedDaysRemaining: { type: "integer" },
      },
      required: ["renewedExpiryDate", "signedDaysRemaining"],
    },
    ports: {
      inputs: [
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originalExpiryDate",
          label: "Original Expiry Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "renewalDays",
          label: "Renewal Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "renewedExpiryDate",
          label: "Renewed Expiry Date",
          valueType: { type: "string" },
        },
        {
          id: "signedDaysRemaining",
          label: "Signed Days Remaining",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = holdRequestExpiryRenewalMarginTool.execute;
export default holdRequestExpiryRenewalMarginTool;
