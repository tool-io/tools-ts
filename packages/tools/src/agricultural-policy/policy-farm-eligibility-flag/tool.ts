import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredChecks: readonly boolean[];
  readonly exclusionRecorded: boolean;
};
export type Output = { readonly passesSuppliedChecks: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredChecks: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    exclusionRecorded: { type: "boolean" },
  },
  required: ["requiredChecks", "exclusionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { passesSuppliedChecks: { type: "boolean" } },
  required: ["passesSuppliedChecks"],
} as const;
/** Combine an explicit nonempty list of required-check results and an exclusion flag without deciding statutory eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredChecks, exclusionRecorded } = request;
  const compute = (): Output => {
    H.domain(requiredChecks.length > 0, "requiredChecks");
    return {
      passesSuppliedChecks:
        requiredChecks.every((value) => value) && !exclusionRecorded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredChecks: [true, true], exclusionRecorded: false },
  output: { passesSuppliedChecks: true },
} satisfies ToolExample<Input, Output>;
export const policyFarmEligibilityFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agricultural-policy", "agricultural policy", "agriculture"],
      keywords: ["agricultural policy", "agriculture"],
    },
    id: "agricultural-policy/policy-farm-eligibility-flag",
    title: "Policy Farm Eligibility Flag",
    description:
      "Combine an explicit nonempty list of required-check results and an exclusion flag without deciding statutory eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredChecks: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        exclusionRecorded: { type: "boolean" },
      },
      required: ["requiredChecks", "exclusionRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { passesSuppliedChecks: { type: "boolean" } },
      required: ["passesSuppliedChecks"],
    },
    ports: {
      inputs: [
        {
          id: "requiredChecks",
          label: "Required Checks",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "exclusionRecorded",
          label: "Exclusion Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "passesSuppliedChecks",
          label: "Passes Supplied Checks",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyFarmEligibilityFlagTool.execute;
export default policyFarmEligibilityFlagTool;
