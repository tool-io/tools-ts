import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seasonCode: string;
  readonly approvedSeasons: readonly string[];
  readonly consentActive: boolean;
};
export type Output = { readonly accessMatchesRecordedConditions: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seasonCode: { type: "string", maxLength: 8192 },
    approvedSeasons: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    consentActive: { type: "boolean" },
  },
  required: ["seasonCode", "approvedSeasons", "consentActive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { accessMatchesRecordedConditions: { type: "boolean" } },
  required: ["accessMatchesRecordedConditions"],
} as const;
/** Check literal season-code membership and an explicit community-consent flag without discovering access rules or independently authorizing access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seasonCode, approvedSeasons, consentActive } = request;
  const compute = (): Output => {
    H.domain(seasonCode.length > 0, "seasonCode");
    return {
      accessMatchesRecordedConditions:
        consentActive && approvedSeasons.includes(seasonCode),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    seasonCode: "season-A",
    approvedSeasons: ["season-A", "season-B"],
    consentActive: true,
  },
  output: { accessMatchesRecordedConditions: true },
} satisfies ToolExample<Input, Output>;
export const communityConsentSeasonAccessFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/community-consent-season-access-flag",
    title: "Community Consent Season Access Flag Tool",
    description:
      "Check literal season-code membership and an explicit community-consent flag without discovering access rules or independently authorizing access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seasonCode: { type: "string", maxLength: 8192 },
        approvedSeasons: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        consentActive: { type: "boolean" },
      },
      required: ["seasonCode", "approvedSeasons", "consentActive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { accessMatchesRecordedConditions: { type: "boolean" } },
      required: ["accessMatchesRecordedConditions"],
    },
    ports: {
      inputs: [
        {
          id: "seasonCode",
          label: "Season Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "approvedSeasons",
          label: "Approved Seasons",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "consentActive",
          label: "Consent Active",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "accessMatchesRecordedConditions",
          label: "Access Matches Recorded Conditions",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = communityConsentSeasonAccessFlagTool.execute;
export default communityConsentSeasonAccessFlagTool;
