import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stepIds: readonly string[];
  readonly signoffSources: readonly string[];
  readonly requiredRoles: readonly string[];
  readonly recordedRoles: readonly string[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly steps: number;
  readonly missingSources: number;
  readonly roleMismatches: number;
  readonly verifiedMatchingSignoffs: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    signoffSources: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recordedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "stepIds",
    "signoffSources",
    "requiredRoles",
    "recordedRoles",
    "sourceVerified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    steps: { type: "integer" },
    missingSources: { type: "integer" },
    roleMismatches: { type: "integer" },
    verifiedMatchingSignoffs: { type: "integer" },
  },
  required: [
    "steps",
    "missingSources",
    "roleMismatches",
    "verifiedMatchingSignoffs",
  ],
} as const;
/** Inspect explicit signoff provenance and role metadata without batch-release or GMP-compliance decisions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    stepIds,
    signoffSources,
    requiredRoles,
    recordedRoles,
    sourceVerified,
  } = request;
  const compute = (): Output => {
    H.sameLength(stepIds, signoffSources);
    H.sameLength(stepIds, requiredRoles);
    H.sameLength(stepIds, recordedRoles);
    H.sameLength(stepIds, sourceVerified);
    H.domain(new Set(stepIds).size === stepIds.length);
    return {
      steps: stepIds.length,
      missingSources: signoffSources.filter((x) => x.length === 0).length,
      roleMismatches: requiredRoles.filter((x, i) => x !== recordedRoles[i])
        .length,
      verifiedMatchingSignoffs: stepIds.filter(
        (x, i) =>
          signoffSources[i].length > 0 &&
          requiredRoles[i] === recordedRoles[i] &&
          sourceVerified[i],
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stepIds: ["a", "b"],
    signoffSources: ["s1", ""],
    requiredRoles: ["r1", "r2"],
    recordedRoles: ["r1", "r1"],
    sourceVerified: [true, false],
  },
  output: {
    steps: 2,
    missingSources: 1,
    roleMismatches: 1,
    verifiedMatchingSignoffs: 1,
  },
} satisfies ToolExample<Input, Output>;
export const batchSignoffSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/batch-signoff-source-gap",
    title: "Batch Signoff Source Gap Tool",
    description:
      "Inspect explicit signoff provenance and role metadata without batch-release or GMP-compliance decisions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stepIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        signoffSources: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recordedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "stepIds",
        "signoffSources",
        "requiredRoles",
        "recordedRoles",
        "sourceVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        steps: { type: "integer" },
        missingSources: { type: "integer" },
        roleMismatches: { type: "integer" },
        verifiedMatchingSignoffs: { type: "integer" },
      },
      required: [
        "steps",
        "missingSources",
        "roleMismatches",
        "verifiedMatchingSignoffs",
      ],
    },
    ports: {
      inputs: [
        {
          id: "stepIds",
          label: "Step Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "signoffSources",
          label: "Signoff Sources",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredRoles",
          label: "Required Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "recordedRoles",
          label: "Recorded Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "steps", label: "Steps", valueType: { type: "integer" } },
        {
          id: "missingSources",
          label: "Missing Sources",
          valueType: { type: "integer" },
        },
        {
          id: "roleMismatches",
          label: "Role Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "verifiedMatchingSignoffs",
          label: "Verified Matching Signoffs",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = batchSignoffSourceGapTool.execute;
export default batchSignoffSourceGapTool;
