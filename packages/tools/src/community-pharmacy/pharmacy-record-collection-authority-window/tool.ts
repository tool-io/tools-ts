import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectorId: string;
  readonly authorizedIds: readonly string[];
  readonly startDay: number;
  readonly endDay: number;
  readonly collectionDay: number;
  readonly revoked: boolean;
};
export type Output = {
  readonly identityListed: boolean;
  readonly insideWindow: boolean;
  readonly eligible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectorId: { type: "string", maxLength: 8192 },
    authorizedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    startDay: { type: "integer" },
    endDay: { type: "integer" },
    collectionDay: { type: "integer" },
    revoked: { type: "boolean" },
  },
  required: [
    "collectorId",
    "authorizedIds",
    "startDay",
    "endDay",
    "collectionDay",
    "revoked",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identityListed: { type: "boolean" },
    insideWindow: { type: "boolean" },
    eligible: { type: "boolean" },
  },
  required: ["identityListed", "insideWindow", "eligible"],
} as const;
/** Check supplied collection-authority identity/window fields without identity verification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    collectorId,
    authorizedIds,
    startDay,
    endDay,
    collectionDay,
    revoked,
  } = request;
  const compute = (): Output => {
    H.domain(endDay >= startDay);
    const identityListed = authorizedIds.includes(collectorId),
      insideWindow: boolean =
        collectionDay >= startDay && collectionDay < endDay;
    return {
      identityListed,
      insideWindow,
      eligible: identityListed && insideWindow && !revoked,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectorId: "A",
    authorizedIds: ["A", "B"],
    startDay: 100,
    endDay: 110,
    collectionDay: 105,
    revoked: false,
  },
  output: { identityListed: true, insideWindow: true, eligible: true },
} satisfies ToolExample<Input, Output>;
export const pharmacyRecordCollectionAuthorityWindowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "community-pharmacy/pharmacy-record-collection-authority-window",
      title: "Pharmacy Record Collection Authority Window Tool",
      description:
        "Check supplied collection-authority identity/window fields without identity verification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          collectorId: { type: "string", maxLength: 8192 },
          authorizedIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          startDay: { type: "integer" },
          endDay: { type: "integer" },
          collectionDay: { type: "integer" },
          revoked: { type: "boolean" },
        },
        required: [
          "collectorId",
          "authorizedIds",
          "startDay",
          "endDay",
          "collectionDay",
          "revoked",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          identityListed: { type: "boolean" },
          insideWindow: { type: "boolean" },
          eligible: { type: "boolean" },
        },
        required: ["identityListed", "insideWindow", "eligible"],
      },
      ports: {
        inputs: [
          {
            id: "collectorId",
            label: "Collector Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "authorizedIds",
            label: "Authorized Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "startDay",
            label: "Start Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "endDay",
            label: "End Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "collectionDay",
            label: "Collection Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "revoked",
            label: "Revoked",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "identityListed",
            label: "Identity Listed",
            valueType: { type: "boolean" },
          },
          {
            id: "insideWindow",
            label: "Inside Window",
            valueType: { type: "boolean" },
          },
          { id: "eligible", label: "Eligible", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = pharmacyRecordCollectionAuthorityWindowTool.execute;
export default pharmacyRecordCollectionAuthorityWindowTool;
