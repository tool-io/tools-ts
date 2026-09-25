import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly metadata: string };
export type Output = { readonly identifiers: readonly string[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { metadata: { type: "string", maxLength: 8192 } },
  required: ["metadata"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifiers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["identifiers"],
} as const;
/** Calculate semver build metadata identifiers from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { metadata } = input;
  const compute = (): Output => {
    H.domain(/^[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*(?![\s\S])/.test(metadata));
    return { identifiers: metadata.split(".") };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { metadata: "build.001.sha-abc" },
  output: { identifiers: ["build", "001", "sha-abc"] },
} satisfies ToolExample<Input, Output>;
export const semverBuildMetadataIdentifiersTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/semver-build-metadata-identifiers",
    title: "SemVer Build Metadata Identifiers Tool",
    description:
      "Calculate semver build metadata identifiers from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { metadata: { type: "string", maxLength: 8192 } },
      required: ["metadata"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identifiers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["identifiers"],
    },
    ports: {
      inputs: [
        {
          id: "metadata",
          label: "Metadata",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "identifiers",
          label: "Identifiers",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = semverBuildMetadataIdentifiersTool.execute;
export default semverBuildMetadataIdentifiersTool;
