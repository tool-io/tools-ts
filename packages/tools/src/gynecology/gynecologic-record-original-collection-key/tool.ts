import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalId: string;
  readonly collectionId: string;
  readonly revisionId: string;
  readonly parentOriginalId: string;
};
export type Output = {
  readonly sameOriginal: boolean;
  readonly collectionKey: string;
  readonly revisionKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalId: { type: "string", maxLength: 8192 },
    collectionId: { type: "string", maxLength: 8192 },
    revisionId: { type: "string", maxLength: 8192 },
    parentOriginalId: { type: "string", maxLength: 8192 },
  },
  required: ["originalId", "collectionId", "revisionId", "parentOriginalId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameOriginal: { type: "boolean" },
    collectionKey: { type: "string", maxLength: 8192 },
    revisionKey: { type: "string", maxLength: 8192 },
  },
  required: ["sameOriginal", "collectionKey", "revisionKey"],
} as const;
/** Construct lossless collection/revision keys and check an original-record link. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalId, collectionId, revisionId, parentOriginalId } = request;
  const compute = (): Output => {
    H.domain(
      [originalId, collectionId, revisionId, parentOriginalId].every(
        (x) => x.length > 0,
      ),
      "originalId",
    );
    return {
      sameOriginal: originalId === parentOriginalId,
      collectionKey: JSON.stringify([originalId, collectionId]),
      revisionKey: JSON.stringify([originalId, collectionId, revisionId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalId: "R1",
    collectionId: "C1",
    revisionId: "v2",
    parentOriginalId: "R1",
  },
  output: {
    sameOriginal: true,
    collectionKey: '["R1","C1"]',
    revisionKey: '["R1","C1","v2"]',
  },
} satisfies ToolExample<Input, Output>;
export const gynecologicRecordOriginalCollectionKeyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gynecology/gynecologic-record-original-collection-key",
      title: "Gynecologic Record Original Collection Key Tool",
      description:
        "Construct lossless collection/revision keys and check an original-record link.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalId: { type: "string", maxLength: 8192 },
          collectionId: { type: "string", maxLength: 8192 },
          revisionId: { type: "string", maxLength: 8192 },
          parentOriginalId: { type: "string", maxLength: 8192 },
        },
        required: [
          "originalId",
          "collectionId",
          "revisionId",
          "parentOriginalId",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sameOriginal: { type: "boolean" },
          collectionKey: { type: "string", maxLength: 8192 },
          revisionKey: { type: "string", maxLength: 8192 },
        },
        required: ["sameOriginal", "collectionKey", "revisionKey"],
      },
      ports: {
        inputs: [
          {
            id: "originalId",
            label: "Original Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "collectionId",
            label: "Collection Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "revisionId",
            label: "Revision Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "parentOriginalId",
            label: "Parent Original Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "sameOriginal",
            label: "Same Original",
            valueType: { type: "boolean" },
          },
          {
            id: "collectionKey",
            label: "Collection Key",
            valueType: { type: "string" },
          },
          {
            id: "revisionKey",
            label: "Revision Key",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gynecologicRecordOriginalCollectionKeyTool.execute;
export default gynecologicRecordOriginalCollectionKeyTool;
