import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  dateOnly,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly sourceDate: string;
  readonly targetYear: number;
  readonly policy: string;
};
export type Output = { readonly date: string; readonly adjusted: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceDate: { type: "string", maxLength: 8192 },
    targetYear: { type: "integer", minimum: 1, maximum: 9999 },
    policy: { type: "string", maxLength: 8192, enum: ["february28", "march1"] },
  },
  required: ["sourceDate", "targetYear", "policy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    date: { type: "string", maxLength: 8192 },
    adjusted: { type: "boolean" },
  },
  required: ["date", "adjusted"],
} as const;
/** Compute calendar anniversary february policy flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { sourceDate, targetYear, policy } = input;
  const compute = (): Output => {
    const d = dateOnly(sourceDate);
    integer(targetYear, 1, 9999);
    domain(["february28", "march1"].includes(policy));
    const leap =
        targetYear % 4 === 0 &&
        (targetYear % 100 !== 0 || targetYear % 400 === 0),
      adjusted = d.getUTCMonth() === 1 && d.getUTCDate() === 29 && !leap;
    return {
      date:
        String(targetYear).padStart(4, "0") +
        "-" +
        (adjusted
          ? policy === "february28"
            ? "02-28"
            : "03-01"
          : sourceDate.slice(5)),
      adjusted,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sourceDate: "2024-02-29", targetYear: 2025, policy: "february28" },
  output: { date: "2025-02-28", adjusted: true },
} satisfies ToolExample<Input, Output>;
export const calendarAnniversaryFebruaryPolicyFlagTool =
  defineSchemaCalculation<Input, Output>({
    id: "date/calendar-anniversary-february-policy-flag",
    title: "Calendar Anniversary February Policy Flag Tool",
    description:
      "Compute calendar anniversary february policy flag from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "sourceDate",
          label: "Source Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetYear",
          label: "Target Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "policy",
          label: "Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "date", label: "Date", valueType: { type: "string" } },
        { id: "adjusted", label: "Adjusted", valueType: { type: "boolean" } },
      ],
    },
  });
export const run = calendarAnniversaryFebruaryPolicyFlagTool.execute;
export default calendarAnniversaryFebruaryPolicyFlagTool;
