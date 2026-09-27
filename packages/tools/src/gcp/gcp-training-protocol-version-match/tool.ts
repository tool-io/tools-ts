import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly staffIds: readonly string[];
  readonly trainedVersions: readonly string[];
  readonly requiredVersion: string;
};
export type Output = {
  readonly matchedIds: readonly string[];
  readonly mismatchedIds: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    staffIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    trainedVersions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredVersion: { type: "string", maxLength: 8192 },
  },
  required: ["staffIds", "trainedVersions", "requiredVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    mismatchedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["matchedIds", "mismatchedIds"],
} as const;
/** Compare supplied staff training versions to an explicit protocol version. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { staffIds, trainedVersions, requiredVersion } = request;
  const compute = (): Output => {
    H.sameLength(staffIds, trainedVersions);
    H.domain(new Set(staffIds).size === staffIds.length);
    return {
      matchedIds: staffIds.filter(
        (_, i) => trainedVersions[i] === requiredVersion,
      ),
      mismatchedIds: staffIds.filter(
        (_, i) => trainedVersions[i] !== requiredVersion,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    staffIds: ["A", "B"],
    trainedVersions: ["v1", "v2"],
    requiredVersion: "v2",
  },
  output: { matchedIds: ["B"], mismatchedIds: ["A"] },
} satisfies ToolExample<Input, Output>;
export const gcpTrainingProtocolVersionMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-training-protocol-version-match",
    title: "GCP Training Protocol Version Match Tool",
    description:
      "Compare supplied staff training versions to an explicit protocol version.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        staffIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        trainedVersions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredVersion: { type: "string", maxLength: 8192 },
      },
      required: ["staffIds", "trainedVersions", "requiredVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchedIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        mismatchedIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["matchedIds", "mismatchedIds"],
    },
    ports: {
      inputs: [
        {
          id: "staffIds",
          label: "Staff Ids",
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
          id: "requiredVersion",
          label: "Required Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "matchedIds",
          label: "Matched Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "mismatchedIds",
          label: "Mismatched Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = gcpTrainingProtocolVersionMatchTool.execute;
export default gcpTrainingProtocolVersionMatchTool;
