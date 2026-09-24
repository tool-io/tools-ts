import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedSource: string;
  readonly actualSource: string;
  readonly expectedVersion: string;
  readonly actualVersion: string;
};
export type Output = {
  readonly sameSource: boolean;
  readonly sameVersion: boolean;
  readonly exactMatch: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedSource: { type: "string", maxLength: 8192 },
    actualSource: { type: "string", maxLength: 8192 },
    expectedVersion: { type: "string", maxLength: 8192 },
    actualVersion: { type: "string", maxLength: 8192 },
  },
  required: [
    "expectedSource",
    "actualSource",
    "expectedVersion",
    "actualVersion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameSource: { type: "boolean" },
    sameVersion: { type: "boolean" },
    exactMatch: { type: "boolean" },
  },
  required: ["sameSource", "sameVersion", "exactMatch"],
} as const;
/** Compare literal research form source/version metadata without certifying a document. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedSource, actualSource, expectedVersion, actualVersion } =
    request;
  const compute = (): Output => {
    const sameSource = expectedSource === actualSource,
      sameVersion = expectedVersion === actualVersion;
    return { sameSource, sameVersion, exactMatch: sameSource && sameVersion };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    expectedSource: "A",
    actualSource: "A",
    expectedVersion: "v2",
    actualVersion: "v1",
  },
  output: { sameSource: true, sameVersion: false, exactMatch: false },
} satisfies ToolExample<Input, Output>;
export const formVersionSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/form-version-source-gap",
    title: "Form Version Source Gap Tool",
    description:
      "Compare literal research form source/version metadata without certifying a document.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedSource: { type: "string", maxLength: 8192 },
        actualSource: { type: "string", maxLength: 8192 },
        expectedVersion: { type: "string", maxLength: 8192 },
        actualVersion: { type: "string", maxLength: 8192 },
      },
      required: [
        "expectedSource",
        "actualSource",
        "expectedVersion",
        "actualVersion",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameSource: { type: "boolean" },
        sameVersion: { type: "boolean" },
        exactMatch: { type: "boolean" },
      },
      required: ["sameSource", "sameVersion", "exactMatch"],
    },
    ports: {
      inputs: [
        {
          id: "expectedSource",
          label: "Expected Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "actualSource",
          label: "Actual Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedVersion",
          label: "Expected Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "actualVersion",
          label: "Actual Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sameSource",
          label: "Same Source",
          valueType: { type: "boolean" },
        },
        {
          id: "sameVersion",
          label: "Same Version",
          valueType: { type: "boolean" },
        },
        {
          id: "exactMatch",
          label: "Exact Match",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = formVersionSourceGapTool.execute;
export default formVersionSourceGapTool;
