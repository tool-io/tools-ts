import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly meetsInclusion: boolean;
  readonly meetsExclusion: boolean;
};
export type Output = { readonly eligibleUnderSuppliedFlags: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meetsInclusion: { type: "boolean" },
    meetsExclusion: { type: "boolean" },
  },
  required: ["meetsInclusion", "meetsExclusion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligibleUnderSuppliedFlags: { type: "boolean" } },
  required: ["eligibleUnderSuppliedFlags"],
} as const;
/** Combine explicit inclusion and exclusion flags, with exclusion taking precedence; no eligibility criteria are inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { meetsInclusion, meetsExclusion } = request;
  const compute = (): Output => {
    return { eligibleUnderSuppliedFlags: meetsInclusion && !meetsExclusion };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { meetsInclusion: true, meetsExclusion: false },
  output: { eligibleUnderSuppliedFlags: true },
} satisfies ToolExample<Input, Output>;
export const interventionEligibleExcludedFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/intervention-eligible-excluded-flag",
    title: "Intervention Eligible Excluded Flag Tool",
    description:
      "Combine explicit inclusion and exclusion flags, with exclusion taking precedence; no eligibility criteria are inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meetsInclusion: { type: "boolean" },
        meetsExclusion: { type: "boolean" },
      },
      required: ["meetsInclusion", "meetsExclusion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { eligibleUnderSuppliedFlags: { type: "boolean" } },
      required: ["eligibleUnderSuppliedFlags"],
    },
    ports: {
      inputs: [
        {
          id: "meetsInclusion",
          label: "Meets Inclusion",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "meetsExclusion",
          label: "Meets Exclusion",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "eligibleUnderSuppliedFlags",
          label: "Eligible Under Supplied Flags",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = interventionEligibleExcludedFlagTool.execute;
export default interventionEligibleExcludedFlagTool;
