import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly communityRecordId: string;
  readonly suppliedPreferredName: string;
  readonly applicablePeriodText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    communityRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPreferredName: { type: "string", maxLength: 8192, minLength: 1 },
    applicablePeriodText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "communityRecordId",
    "suppliedPreferredName",
    "applicablePeriodText",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly supplied community preferred-name and period label without choosing a name or asserting present usage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { communityRecordId, suppliedPreferredName, applicablePeriodText } =
    request;
  const compute = (): Output => {
    H.domain(communityRecordId.length > 0, "communityRecordId");
    H.domain(suppliedPreferredName.length > 0, "suppliedPreferredName");
    H.domain(applicablePeriodText.length > 0, "applicablePeriodText");
    return {
      token: JSON.stringify([
        communityRecordId,
        suppliedPreferredName,
        applicablePeriodText,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    communityRecordId: "C17",
    suppliedPreferredName: "Preferred name A",
    applicablePeriodText: "Period A",
  },
  output: { token: '["C17","Preferred name A","Period A"]' },
} satisfies ToolExample<Input, Output>;
export const communityPreferredNamePeriodLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["indigenous-studies", "indigenous studies", "humanities"],
      keywords: ["indigenous studies", "humanities"],
    },
    id: "indigenous-studies/community-preferred-name-period-label",
    title: "Community Preferred Name Period Label",
    description:
      "Preserve an explicitly supplied community preferred-name and period label without choosing a name or asserting present usage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        communityRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPreferredName: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        applicablePeriodText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "communityRecordId",
        "suppliedPreferredName",
        "applicablePeriodText",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "communityRecordId",
          label: "Community Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPreferredName",
          label: "Supplied Preferred Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "applicablePeriodText",
          label: "Applicable Period Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = communityPreferredNamePeriodLabelTool.execute;
export default communityPreferredNamePeriodLabelTool;
