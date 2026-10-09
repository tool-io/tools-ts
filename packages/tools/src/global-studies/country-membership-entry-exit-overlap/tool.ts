import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly membershipStart: number;
  readonly membershipEnd: number;
  readonly periodStart: number;
  readonly periodEnd: number;
};
export type Output = { readonly overlapDuration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    membershipStart: { type: "number" },
    membershipEnd: { type: "number" },
    periodStart: { type: "number" },
    periodEnd: { type: "number" },
  },
  required: ["membershipStart", "membershipEnd", "periodStart", "periodEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlapDuration: { type: "number" } },
  required: ["overlapDuration"],
} as const;
/** Calculate explicit half-open country membership and reporting-period overlap without deciding membership dates or institutional status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { membershipStart, membershipEnd, periodStart, periodEnd } = request;
  const compute = (): Output => {
    H.domain(membershipEnd >= membershipStart, "membershipEnd");
    H.domain(periodEnd >= periodStart, "periodEnd");
    return {
      overlapDuration: Math.max(
        0,
        Math.min(membershipEnd, periodEnd) -
          Math.max(membershipStart, periodStart),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    membershipStart: 2,
    membershipEnd: 8,
    periodStart: 4,
    periodEnd: 10,
  },
  output: { overlapDuration: 4 },
} satisfies ToolExample<Input, Output>;
export const countryMembershipEntryExitOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/country-membership-entry-exit-overlap",
    title: "Country Membership Entry Exit Overlap Tool",
    description:
      "Calculate explicit half-open country membership and reporting-period overlap without deciding membership dates or institutional status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        membershipStart: { type: "number" },
        membershipEnd: { type: "number" },
        periodStart: { type: "number" },
        periodEnd: { type: "number" },
      },
      required: [
        "membershipStart",
        "membershipEnd",
        "periodStart",
        "periodEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlapDuration: { type: "number" } },
      required: ["overlapDuration"],
    },
    ports: {
      inputs: [
        {
          id: "membershipStart",
          label: "Membership Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "membershipEnd",
          label: "Membership End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodStart",
          label: "Period Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodEnd",
          label: "Period End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = countryMembershipEntryExitOverlapTool.execute;
export default countryMembershipEntryExitOverlapTool;
