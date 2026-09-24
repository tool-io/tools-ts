import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly medicineReference: string;
  readonly versionDelimiter: string;
  readonly expectedVersion: string;
};
export type Output = {
  readonly medicineToken: string;
  readonly sourceVersion: string;
  readonly versionPresent: boolean;
  readonly matchesExpected: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    medicineReference: { type: "string", maxLength: 8192 },
    versionDelimiter: { type: "string", maxLength: 8192 },
    expectedVersion: { type: "string", maxLength: 8192 },
  },
  required: ["medicineReference", "versionDelimiter", "expectedVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    medicineToken: { type: "string", maxLength: 8192 },
    sourceVersion: { type: "string", maxLength: 8192 },
    versionPresent: { type: "boolean" },
    matchesExpected: { type: "boolean" },
  },
  required: [
    "medicineToken",
    "sourceVersion",
    "versionPresent",
    "matchesExpected",
  ],
} as const;
/** Inspect explicit medicine-reference version metadata without medicine identification or prescribing rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { medicineReference, versionDelimiter, expectedVersion } = request;
  const compute = (): Output => {
    H.domain(versionDelimiter.length > 0);
    const i = medicineReference.lastIndexOf(versionDelimiter),
      sourceVersion =
        i < 0 ? "" : medicineReference.slice(i + versionDelimiter.length);
    return {
      medicineToken: i < 0 ? medicineReference : medicineReference.slice(0, i),
      sourceVersion,
      versionPresent: i >= 0,
      matchesExpected: i >= 0 && sourceVersion === expectedVersion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    medicineReference: "med@v2",
    versionDelimiter: "@",
    expectedVersion: "v2",
  },
  output: {
    medicineToken: "med",
    sourceVersion: "v2",
    versionPresent: true,
    matchesExpected: true,
  },
} satisfies ToolExample<Input, Output>;
export const medicineSourceVersionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/medicine-source-version-gap",
    title: "Medicine Source Version Gap Tool",
    description:
      "Inspect explicit medicine-reference version metadata without medicine identification or prescribing rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        medicineReference: { type: "string", maxLength: 8192 },
        versionDelimiter: { type: "string", maxLength: 8192 },
        expectedVersion: { type: "string", maxLength: 8192 },
      },
      required: ["medicineReference", "versionDelimiter", "expectedVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        medicineToken: { type: "string", maxLength: 8192 },
        sourceVersion: { type: "string", maxLength: 8192 },
        versionPresent: { type: "boolean" },
        matchesExpected: { type: "boolean" },
      },
      required: [
        "medicineToken",
        "sourceVersion",
        "versionPresent",
        "matchesExpected",
      ],
    },
    ports: {
      inputs: [
        {
          id: "medicineReference",
          label: "Medicine Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "versionDelimiter",
          label: "Version Delimiter",
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
          id: "medicineToken",
          label: "Medicine Token",
          valueType: { type: "string" },
        },
        {
          id: "sourceVersion",
          label: "Source Version",
          valueType: { type: "string" },
        },
        {
          id: "versionPresent",
          label: "Version Present",
          valueType: { type: "boolean" },
        },
        {
          id: "matchesExpected",
          label: "Matches Expected",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = medicineSourceVersionGapTool.execute;
export default medicineSourceVersionGapTool;
