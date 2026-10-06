import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly artifactMarked: boolean;
  readonly excludedByProtocol: boolean;
};
export type Output = { readonly includedUnderFlags: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    artifactMarked: { type: "boolean" },
    excludedByProtocol: { type: "boolean" },
  },
  required: ["artifactMarked", "excludedByProtocol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { includedUnderFlags: { type: "boolean" } },
  required: ["includedUnderFlags"],
} as const;
/** Combine explicit research artifact and exclusion flags without detecting artifacts or making clinical decisions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { artifactMarked, excludedByProtocol } = request;
  const compute = (): Output => {
    return { includedUnderFlags: !artifactMarked && !excludedByProtocol };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { artifactMarked: false, excludedByProtocol: false },
  output: { includedUnderFlags: true },
} satisfies ToolExample<Input, Output>;
export const anesthesiaResearchArtifactMaskFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anesthesiology", "health and medicine"],
      keywords: ["anesthesiology", "health and medicine"],
    },
    id: "anesthesiology/anesthesia-research-artifact-mask-flag",
    title: "Anesthesia Research Artifact Mask Flag",
    description:
      "Combine explicit research artifact and exclusion flags without detecting artifacts or making clinical decisions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        artifactMarked: { type: "boolean" },
        excludedByProtocol: { type: "boolean" },
      },
      required: ["artifactMarked", "excludedByProtocol"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { includedUnderFlags: { type: "boolean" } },
      required: ["includedUnderFlags"],
    },
    ports: {
      inputs: [
        {
          id: "artifactMarked",
          label: "Artifact Marked",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "excludedByProtocol",
          label: "Excluded By Protocol",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "includedUnderFlags",
          label: "Included Under Flags",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = anesthesiaResearchArtifactMaskFlagTool.execute;
export default anesthesiaResearchArtifactMaskFlagTool;
