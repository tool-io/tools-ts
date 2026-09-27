import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedSeal: string;
  readonly recordedVersion: string;
  readonly expectedSeal: string;
  readonly expectedVersion: string;
};
export type Output = {
  readonly sealMatches: boolean;
  readonly versionMatches: boolean;
  readonly matches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedSeal: { type: "string", maxLength: 8192 },
    recordedVersion: { type: "string", maxLength: 8192 },
    expectedSeal: { type: "string", maxLength: 8192 },
    expectedVersion: { type: "string", maxLength: 8192 },
  },
  required: [
    "recordedSeal",
    "recordedVersion",
    "expectedSeal",
    "expectedVersion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sealMatches: { type: "boolean" },
    versionMatches: { type: "boolean" },
    matches: { type: "boolean" },
  },
  required: ["sealMatches", "versionMatches", "matches"],
} as const;
/** Literal supplied seal/version consistency only, without authenticity or evidentiary conclusions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedSeal, recordedVersion, expectedSeal, expectedVersion } =
    request;
  const compute = (): Output => {
    const sealMatches = recordedSeal === expectedSeal,
      versionMatches = recordedVersion === expectedVersion;
    return {
      sealMatches,
      versionMatches,
      matches: sealMatches && versionMatches,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedSeal: "S1",
    recordedVersion: "v2",
    expectedSeal: "S1",
    expectedVersion: "v2",
  },
  output: { sealMatches: true, versionMatches: true, matches: true },
} satisfies ToolExample<Input, Output>;
export const exhibitSealVersionMatchFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/exhibit-seal-version-match-flag",
    title: "Exhibit Seal Version Match Flag Tool",
    description:
      "Literal supplied seal/version consistency only, without authenticity or evidentiary conclusions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedSeal: { type: "string", maxLength: 8192 },
        recordedVersion: { type: "string", maxLength: 8192 },
        expectedSeal: { type: "string", maxLength: 8192 },
        expectedVersion: { type: "string", maxLength: 8192 },
      },
      required: [
        "recordedSeal",
        "recordedVersion",
        "expectedSeal",
        "expectedVersion",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sealMatches: { type: "boolean" },
        versionMatches: { type: "boolean" },
        matches: { type: "boolean" },
      },
      required: ["sealMatches", "versionMatches", "matches"],
    },
    ports: {
      inputs: [
        {
          id: "recordedSeal",
          label: "Recorded Seal",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedVersion",
          label: "Recorded Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedSeal",
          label: "Expected Seal",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedVersion",
          label: "Expected Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sealMatches",
          label: "Seal Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "versionMatches",
          label: "Version Matches",
          valueType: { type: "boolean" },
        },
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = exhibitSealVersionMatchFlagTool.execute;
export default exhibitSealVersionMatchFlagTool;
