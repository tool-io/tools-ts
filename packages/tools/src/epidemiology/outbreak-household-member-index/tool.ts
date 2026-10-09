import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly householdCode: string;
  readonly memberIndex: number;
  readonly oneBasedInput: boolean;
};
export type Output = {
  readonly memberToken: string;
  readonly zeroBasedIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    householdCode: { type: "string", maxLength: 8192, minLength: 1 },
    memberIndex: { type: "integer", minimum: 0 },
    oneBasedInput: { type: "boolean" },
  },
  required: ["householdCode", "memberIndex", "oneBasedInput"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    memberToken: { type: "string", maxLength: 8192 },
    zeroBasedIndex: { type: "integer" },
  },
  required: ["memberToken", "zeroBasedIndex"],
} as const;
/** Qualify an explicit household-member ordinal under a supplied zero- or one-based indexing convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { householdCode, memberIndex, oneBasedInput } = request;
  const compute = (): Output => {
    H.domain(householdCode.length > 0, "householdCode");
    (H.domain(
      Number.isSafeInteger(memberIndex) &&
        memberIndex >= (oneBasedInput ? 1 : 0) &&
        memberIndex <= Number.MAX_SAFE_INTEGER,
      "memberIndex",
    ),
      memberIndex);
    return {
      memberToken: JSON.stringify([
        householdCode,
        memberIndex - (oneBasedInput ? 1 : 0),
      ]),
      zeroBasedIndex: memberIndex - (oneBasedInput ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { householdCode: "HH17", memberIndex: 3, oneBasedInput: true },
  output: { memberToken: '["HH17",2]', zeroBasedIndex: 2 },
} satisfies ToolExample<Input, Output>;
export const outbreakHouseholdMemberIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["epidemiology", "health and medicine"],
      keywords: ["epidemiology", "health and medicine"],
    },
    id: "epidemiology/outbreak-household-member-index",
    title: "Outbreak Household Member Index",
    description:
      "Qualify an explicit household-member ordinal under a supplied zero- or one-based indexing convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        householdCode: { type: "string", maxLength: 8192, minLength: 1 },
        memberIndex: { type: "integer", minimum: 0 },
        oneBasedInput: { type: "boolean" },
      },
      required: ["householdCode", "memberIndex", "oneBasedInput"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        memberToken: { type: "string", maxLength: 8192 },
        zeroBasedIndex: { type: "integer" },
      },
      required: ["memberToken", "zeroBasedIndex"],
    },
    ports: {
      inputs: [
        {
          id: "householdCode",
          label: "Household Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "memberIndex",
          label: "Member Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oneBasedInput",
          label: "One Based Input",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "memberToken",
          label: "Member Token",
          valueType: { type: "string" },
        },
        {
          id: "zeroBasedIndex",
          label: "Zero Based Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = outbreakHouseholdMemberIndexTool.execute;
export default outbreakHouseholdMemberIndexTool;
