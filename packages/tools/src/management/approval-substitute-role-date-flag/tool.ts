import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asOfDate: string;
  readonly substituteStartDate: string;
  readonly substituteEndDate: string;
  readonly roleMatches: boolean;
};
export type Output = { readonly withinRecordedSubstitution: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asOfDate: { type: "string", maxLength: 8192 },
    substituteStartDate: { type: "string", maxLength: 8192 },
    substituteEndDate: { type: "string", maxLength: 8192 },
    roleMatches: { type: "boolean" },
  },
  required: [
    "asOfDate",
    "substituteStartDate",
    "substituteEndDate",
    "roleMatches",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinRecordedSubstitution: { type: "boolean" } },
  required: ["withinRecordedSubstitution"],
} as const;
/** Combine an explicit role-match flag with an inclusive substitute-role date record without granting approval authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asOfDate, substituteStartDate, substituteEndDate, roleMatches } =
    request;
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
    H.domain(
      namedDate(substituteEndDate, "substituteEndDate") >=
        namedDate(substituteStartDate, "substituteStartDate"),
      "substituteEndDate",
    );
    namedDate(asOfDate, "asOfDate");
    return {
      withinRecordedSubstitution:
        roleMatches &&
        namedDate(asOfDate, "asOfDate") >=
          namedDate(substituteStartDate, "substituteStartDate") &&
        namedDate(asOfDate, "asOfDate") <=
          namedDate(substituteEndDate, "substituteEndDate"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    asOfDate: "2026-11-01",
    substituteStartDate: "2026-10-01",
    substituteEndDate: "2026-12-01",
    roleMatches: true,
  },
  output: { withinRecordedSubstitution: true },
} satisfies ToolExample<Input, Output>;
export const approvalSubstituteRoleDateFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["management", "business and finance"],
      keywords: ["management", "business and finance"],
    },
    id: "management/approval-substitute-role-date-flag",
    title: "Approval Substitute Role Date Flag",
    description:
      "Combine an explicit role-match flag with an inclusive substitute-role date record without granting approval authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asOfDate: { type: "string", maxLength: 8192 },
        substituteStartDate: { type: "string", maxLength: 8192 },
        substituteEndDate: { type: "string", maxLength: 8192 },
        roleMatches: { type: "boolean" },
      },
      required: [
        "asOfDate",
        "substituteStartDate",
        "substituteEndDate",
        "roleMatches",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinRecordedSubstitution: { type: "boolean" } },
      required: ["withinRecordedSubstitution"],
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
          id: "substituteStartDate",
          label: "Substitute Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "substituteEndDate",
          label: "Substitute End Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "roleMatches",
          label: "Role Matches",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "withinRecordedSubstitution",
          label: "Within Recorded Substitution",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = approvalSubstituteRoleDateFlagTool.execute;
export default approvalSubstituteRoleDateFlagTool;
