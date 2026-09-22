import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordPurpose: string;
  readonly permittedPurposes: readonly string[];
  readonly audience: string;
  readonly permittedAudiences: readonly string[];
  readonly pseudonymPresent: boolean;
  readonly withdrawn: boolean;
};
export type Output = {
  readonly scopeMatches: boolean;
  readonly eligibleUnderFlags: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordPurpose: { type: "string", maxLength: 8192 },
    permittedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    audience: { type: "string", maxLength: 8192 },
    permittedAudiences: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    pseudonymPresent: { type: "boolean" },
    withdrawn: { type: "boolean" },
  },
  required: [
    "recordPurpose",
    "permittedPurposes",
    "audience",
    "permittedAudiences",
    "pseudonymPresent",
    "withdrawn",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scopeMatches: { type: "boolean" },
    eligibleUnderFlags: { type: "boolean" },
  },
  required: ["scopeMatches", "eligibleUnderFlags"],
} as const;
/** Check supplied release-purpose/audience and pseudonym/withdrawal flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordPurpose,
    permittedPurposes,
    audience,
    permittedAudiences,
    pseudonymPresent,
    withdrawn,
  } = request;
  const compute = (): Output => {
    const scopeMatches =
      permittedPurposes.includes(recordPurpose) &&
      permittedAudiences.includes(audience);
    return {
      scopeMatches,
      eligibleUnderFlags: scopeMatches && pseudonymPresent && !withdrawn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordPurpose: "study",
    permittedPurposes: ["study"],
    audience: "team",
    permittedAudiences: ["team"],
    pseudonymPresent: true,
    withdrawn: false,
  },
  output: { scopeMatches: true, eligibleUnderFlags: true },
} satisfies ToolExample<Input, Output>;
export const biobankPseudonymReleaseScopeCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/biobank-pseudonym-release-scope-check",
    title: "Biobank Pseudonym Release Scope Check Tool",
    description:
      "Check supplied release-purpose/audience and pseudonym/withdrawal flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordPurpose: { type: "string", maxLength: 8192 },
        permittedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        audience: { type: "string", maxLength: 8192 },
        permittedAudiences: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        pseudonymPresent: { type: "boolean" },
        withdrawn: { type: "boolean" },
      },
      required: [
        "recordPurpose",
        "permittedPurposes",
        "audience",
        "permittedAudiences",
        "pseudonymPresent",
        "withdrawn",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scopeMatches: { type: "boolean" },
        eligibleUnderFlags: { type: "boolean" },
      },
      required: ["scopeMatches", "eligibleUnderFlags"],
    },
    ports: {
      inputs: [
        {
          id: "recordPurpose",
          label: "Record Purpose",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permittedPurposes",
          label: "Permitted Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "audience",
          label: "Audience",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permittedAudiences",
          label: "Permitted Audiences",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "pseudonymPresent",
          label: "Pseudonym Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "withdrawn",
          label: "Withdrawn",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "scopeMatches",
          label: "Scope Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "eligibleUnderFlags",
          label: "Eligible Under Flags",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = biobankPseudonymReleaseScopeCheckTool.execute;
export default biobankPseudonymReleaseScopeCheckTool;
