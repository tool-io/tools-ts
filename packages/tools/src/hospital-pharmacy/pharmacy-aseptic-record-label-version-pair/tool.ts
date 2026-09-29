import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly labelParent: string;
  readonly recordVersion: number;
  readonly labelVersion: number;
  readonly released: boolean;
};
export type Output = {
  readonly parentMatches: boolean;
  readonly versionMatches: boolean;
  readonly releasedWithMismatch: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192 },
    labelParent: { type: "string", maxLength: 8192 },
    recordVersion: { type: "integer", minimum: 0 },
    labelVersion: { type: "integer", minimum: 0 },
    released: { type: "boolean" },
  },
  required: [
    "recordId",
    "labelParent",
    "recordVersion",
    "labelVersion",
    "released",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMatches: { type: "boolean" },
    versionMatches: { type: "boolean" },
    releasedWithMismatch: { type: "boolean" },
  },
  required: ["parentMatches", "versionMatches", "releasedWithMismatch"],
} as const;
/** Compare supplied label provenance/version fields without process or product release approval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, labelParent, recordVersion, labelVersion, released } =
    request;
  const compute = (): Output => {
    H.integer(recordVersion, 0);
    H.integer(labelVersion, 0);
    const parentMatches = recordId === labelParent,
      versionMatches = recordVersion === labelVersion;
    return {
      parentMatches,
      versionMatches,
      releasedWithMismatch: released && (!parentMatches || !versionMatches),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R1",
    labelParent: "R1",
    recordVersion: 2,
    labelVersion: 1,
    released: true,
  },
  output: {
    parentMatches: true,
    versionMatches: false,
    releasedWithMismatch: true,
  },
} satisfies ToolExample<Input, Output>;
export const pharmacyAsepticRecordLabelVersionPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hospital-pharmacy/pharmacy-aseptic-record-label-version-pair",
      title: "Pharmacy Aseptic Record Label Version Pair Tool",
      description:
        "Compare supplied label provenance/version fields without process or product release approval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192 },
          labelParent: { type: "string", maxLength: 8192 },
          recordVersion: { type: "integer", minimum: 0 },
          labelVersion: { type: "integer", minimum: 0 },
          released: { type: "boolean" },
        },
        required: [
          "recordId",
          "labelParent",
          "recordVersion",
          "labelVersion",
          "released",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentMatches: { type: "boolean" },
          versionMatches: { type: "boolean" },
          releasedWithMismatch: { type: "boolean" },
        },
        required: ["parentMatches", "versionMatches", "releasedWithMismatch"],
      },
      ports: {
        inputs: [
          {
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "labelParent",
            label: "Label Parent",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "recordVersion",
            label: "Record Version",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "labelVersion",
            label: "Label Version",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "released",
            label: "Released",
            required: true,
            valueType: { type: "boolean" },
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
            id: "releasedWithMismatch",
            label: "Released With Mismatch",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacyAsepticRecordLabelVersionPairTool.execute;
export default pharmacyAsepticRecordLabelVersionPairTool;
