import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedRole: string;
  readonly requiredVersion: string;
  readonly trainedRoles: readonly string[];
  readonly trainedVersions: readonly string[];
  readonly revoked: readonly boolean[];
};
export type Output = {
  readonly matchingIndices: readonly number[];
  readonly allowedUnderRecords: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedRole: { type: "string", maxLength: 8192 },
    requiredVersion: { type: "string", maxLength: 8192 },
    trainedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    trainedVersions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    revoked: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: [
    "requestedRole",
    "requiredVersion",
    "trainedRoles",
    "trainedVersions",
    "revoked",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchingIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    allowedUnderRecords: { type: "boolean" },
  },
  required: ["matchingIndices", "allowedUnderRecords"],
} as const;
/** Match explicit role/version training records without granting access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    requestedRole,
    requiredVersion,
    trainedRoles,
    trainedVersions,
    revoked,
  } = request;
  const compute = (): Output => {
    H.sameLength(trainedRoles, trainedVersions);
    H.sameLength(trainedRoles, revoked);
    const matchingIndices = trainedRoles.flatMap((x, i) =>
      x === requestedRole &&
      trainedVersions[i] === requiredVersion &&
      !revoked[i]
        ? [i]
        : [],
    );
    return { matchingIndices, allowedUnderRecords: matchingIndices.length > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestedRole: "operator",
    requiredVersion: "v2",
    trainedRoles: ["operator", "reviewer"],
    trainedVersions: ["v1", "v2"],
    revoked: [false, false],
  },
  output: { matchingIndices: [], allowedUnderRecords: false },
} satisfies ToolExample<Input, Output>;
export const biosafetyAccessTrainingRoleMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/biosafety-access-training-role-match",
    title: "Biosafety Access Training Role Match Tool",
    description:
      "Match explicit role/version training records without granting access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedRole: { type: "string", maxLength: 8192 },
        requiredVersion: { type: "string", maxLength: 8192 },
        trainedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        trainedVersions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        revoked: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: [
        "requestedRole",
        "requiredVersion",
        "trainedRoles",
        "trainedVersions",
        "revoked",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchingIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        allowedUnderRecords: { type: "boolean" },
      },
      required: ["matchingIndices", "allowedUnderRecords"],
    },
    ports: {
      inputs: [
        {
          id: "requestedRole",
          label: "Requested Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requiredVersion",
          label: "Required Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "trainedRoles",
          label: "Trained Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "trainedVersions",
          label: "Trained Versions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "revoked",
          label: "Revoked",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "matchingIndices",
          label: "Matching Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "allowedUnderRecords",
          label: "Allowed Under Records",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = biosafetyAccessTrainingRoleMatchTool.execute;
export default biosafetyAccessTrainingRoleMatchTool;
