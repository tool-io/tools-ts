import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalId: string;
  readonly addendumParent: string;
  readonly originalVersion: number;
  readonly parentVersion: number;
  readonly addendumVersion: number;
};
export type Output = {
  readonly parentMatches: boolean;
  readonly versionMatches: boolean;
  readonly laterRevision: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalId: { type: "string", maxLength: 8192 },
    addendumParent: { type: "string", maxLength: 8192 },
    originalVersion: { type: "integer", minimum: 0 },
    parentVersion: { type: "integer", minimum: 0 },
    addendumVersion: { type: "integer", minimum: 0 },
  },
  required: [
    "originalId",
    "addendumParent",
    "originalVersion",
    "parentVersion",
    "addendumVersion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMatches: { type: "boolean" },
    versionMatches: { type: "boolean" },
    laterRevision: { type: "boolean" },
  },
  required: ["parentMatches", "versionMatches", "laterRevision"],
} as const;
/** Audit an explicit addendum parent and version sequence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    originalId,
    addendumParent,
    originalVersion,
    parentVersion,
    addendumVersion,
  } = request;
  const compute = (): Output => {
    H.integer(originalVersion, 0);
    H.integer(parentVersion, 0);
    H.integer(addendumVersion, 0);
    return {
      parentMatches: originalId === addendumParent,
      versionMatches: originalVersion === parentVersion,
      laterRevision: addendumVersion > parentVersion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalId: "R1",
    addendumParent: "R1",
    originalVersion: 2,
    parentVersion: 2,
    addendumVersion: 3,
  },
  output: { parentMatches: true, versionMatches: true, laterRevision: true },
} satisfies ToolExample<Input, Output>;
export const oralSurgeryRecordAddendumParentPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "oral-surgery/oral-surgery-record-addendum-parent-pair",
      title: "Oral Surgery Record Addendum Parent Pair Tool",
      description: "Audit an explicit addendum parent and version sequence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalId: { type: "string", maxLength: 8192 },
          addendumParent: { type: "string", maxLength: 8192 },
          originalVersion: { type: "integer", minimum: 0 },
          parentVersion: { type: "integer", minimum: 0 },
          addendumVersion: { type: "integer", minimum: 0 },
        },
        required: [
          "originalId",
          "addendumParent",
          "originalVersion",
          "parentVersion",
          "addendumVersion",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentMatches: { type: "boolean" },
          versionMatches: { type: "boolean" },
          laterRevision: { type: "boolean" },
        },
        required: ["parentMatches", "versionMatches", "laterRevision"],
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
            id: "addendumParent",
            label: "Addendum Parent",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "originalVersion",
            label: "Original Version",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "parentVersion",
            label: "Parent Version",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "addendumVersion",
            label: "Addendum Version",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "parentMatches",
            label: "Parent Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "versionMatches",
            label: "Version Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "laterRevision",
            label: "Later Revision",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = oralSurgeryRecordAddendumParentPairTool.execute;
export default oralSurgeryRecordAddendumParentPairTool;
