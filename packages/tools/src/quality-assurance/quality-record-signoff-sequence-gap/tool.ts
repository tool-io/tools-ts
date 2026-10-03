import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roles: readonly string[];
  readonly requiredRoles: readonly string[];
  readonly signedDays: readonly number[];
};
export type Output = {
  readonly missingRoles: readonly string[];
  readonly reversedIndices: readonly number[];
  readonly lastSignedDay: number;
  readonly hasSignatures: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    signedDays: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["roles", "requiredRoles", "signedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    reversedIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    lastSignedDay: { type: "integer" },
    hasSignatures: { type: "boolean" },
  },
  required: [
    "missingRoles",
    "reversedIndices",
    "lastSignedDay",
    "hasSignatures",
  ],
} as const;
/** Audit supplied signoff roles and chronology with an explicit empty-record flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roles, requiredRoles, signedDays } = request;
  const compute = (): Output => {
    H.sameLength(roles, signedDays);
    const missingRoles = requiredRoles.filter((x) => !roles.includes(x)),
      reversedIndices = signedDays.flatMap((x, i) =>
        i > 0 && x < signedDays[i - 1] ? [i] : [],
      );
    return {
      missingRoles,
      reversedIndices,
      lastSignedDay: signedDays.length ? Math.max(...signedDays) : 0,
      hasSignatures: signedDays.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    roles: ["author", "reviewer"],
    requiredRoles: ["author", "reviewer", "approver"],
    signedDays: [100, 99],
  },
  output: {
    missingRoles: ["approver"],
    reversedIndices: [1],
    lastSignedDay: 100,
    hasSignatures: true,
  },
} satisfies ToolExample<Input, Output>;
export const qualityRecordSignoffSequenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/quality-record-signoff-sequence-gap",
    title: "Quality Record Signoff Sequence Gap Tool",
    description:
      "Audit supplied signoff roles and chronology with an explicit empty-record flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        signedDays: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["roles", "requiredRoles", "signedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        reversedIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        lastSignedDay: { type: "integer" },
        hasSignatures: { type: "boolean" },
      },
      required: [
        "missingRoles",
        "reversedIndices",
        "lastSignedDay",
        "hasSignatures",
      ],
    },
    ports: {
      inputs: [
        {
          id: "roles",
          label: "Roles",
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
          id: "signedDays",
          label: "Signed Days",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "missingRoles",
          label: "Missing Roles",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "reversedIndices",
          label: "Reversed Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "lastSignedDay",
          label: "Last Signed Day",
          valueType: { type: "integer" },
        },
        {
          id: "hasSignatures",
          label: "Has Signatures",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = qualityRecordSignoffSequenceGapTool.execute;
export default qualityRecordSignoffSequenceGapTool;
