import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personIds: readonly string[];
  readonly recordedRoles: readonly string[];
  readonly delegatedRoles: readonly string[];
  readonly delegationSourceIds: readonly string[];
};
export type Output = {
  readonly roleMismatches: number;
  readonly missingSources: number;
  readonly matchingSourcedRecords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recordedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    delegatedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    delegationSourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "personIds",
    "recordedRoles",
    "delegatedRoles",
    "delegationSourceIds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleMismatches: { type: "integer" },
    missingSources: { type: "integer" },
    matchingSourcedRecords: { type: "integer" },
  },
  required: ["roleMismatches", "missingSources", "matchingSourcedRecords"],
} as const;
/** Compare supplied delegation role/source metadata without deciding trial authorization or GCP compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personIds, recordedRoles, delegatedRoles, delegationSourceIds } =
    request;
  const compute = (): Output => {
    H.sameLength(personIds, recordedRoles);
    H.sameLength(personIds, delegatedRoles);
    H.sameLength(personIds, delegationSourceIds);
    return {
      roleMismatches: recordedRoles.filter((x, i) => x !== delegatedRoles[i])
        .length,
      missingSources: delegationSourceIds.filter((x) => x.length === 0).length,
      matchingSourcedRecords: personIds.filter(
        (x, i) =>
          recordedRoles[i] === delegatedRoles[i] &&
          delegationSourceIds[i].length > 0,
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personIds: ["p1", "p2"],
    recordedRoles: ["A", "B"],
    delegatedRoles: ["A", "A"],
    delegationSourceIds: ["s1", ""],
  },
  output: { roleMismatches: 1, missingSources: 1, matchingSourcedRecords: 1 },
} satisfies ToolExample<Input, Output>;
export const delegationRoleSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/delegation-role-source-gap",
    title: "Delegation Role Source Gap Tool",
    description:
      "Compare supplied delegation role/source metadata without deciding trial authorization or GCP compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recordedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        delegatedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        delegationSourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "personIds",
        "recordedRoles",
        "delegatedRoles",
        "delegationSourceIds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roleMismatches: { type: "integer" },
        missingSources: { type: "integer" },
        matchingSourcedRecords: { type: "integer" },
      },
      required: ["roleMismatches", "missingSources", "matchingSourcedRecords"],
    },
    ports: {
      inputs: [
        {
          id: "personIds",
          label: "Person Ids",
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
          id: "delegatedRoles",
          label: "Delegated Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "delegationSourceIds",
          label: "Delegation Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "roleMismatches",
          label: "Role Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "missingSources",
          label: "Missing Sources",
          valueType: { type: "integer" },
        },
        {
          id: "matchingSourcedRecords",
          label: "Matching Sourced Records",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = delegationRoleSourceGapTool.execute;
export default delegationRoleSourceGapTool;
