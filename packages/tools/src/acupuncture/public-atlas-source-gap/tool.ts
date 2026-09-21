import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pointLabels: readonly string[];
  readonly atlasEditions: readonly string[];
  readonly expectedEdition: string;
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly matchingEdition: number;
  readonly verifiedMatchingEdition: number;
  readonly mismatchedEdition: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pointLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    atlasEditions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    expectedEdition: { type: "string", maxLength: 8192 },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "pointLabels",
    "atlasEditions",
    "expectedEdition",
    "sourceVerified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchingEdition: { type: "integer" },
    verifiedMatchingEdition: { type: "integer" },
    mismatchedEdition: { type: "integer" },
  },
  required: ["matchingEdition", "verifiedMatchingEdition", "mismatchedEdition"],
} as const;
/** Compare supplied public atlas edition provenance only; no anatomical targeting or treatment guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pointLabels, atlasEditions, expectedEdition, sourceVerified } =
    request;
  const compute = (): Output => {
    H.sameLength(pointLabels, atlasEditions);
    H.sameLength(pointLabels, sourceVerified);
    return {
      matchingEdition: atlasEditions.filter((x) => x === expectedEdition)
        .length,
      verifiedMatchingEdition: atlasEditions.filter(
        (x, i) => x === expectedEdition && sourceVerified[i],
      ).length,
      mismatchedEdition: atlasEditions.filter((x) => x !== expectedEdition)
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pointLabels: ["A", "B"],
    atlasEditions: ["v2", "v1"],
    expectedEdition: "v2",
    sourceVerified: [true, true],
  },
  output: {
    matchingEdition: 1,
    verifiedMatchingEdition: 1,
    mismatchedEdition: 1,
  },
} satisfies ToolExample<Input, Output>;
export const publicAtlasSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "acupuncture/public-atlas-source-gap",
    title: "Public Atlas Source Gap Tool",
    description:
      "Compare supplied public atlas edition provenance only; no anatomical targeting or treatment guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pointLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        atlasEditions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        expectedEdition: { type: "string", maxLength: 8192 },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "pointLabels",
        "atlasEditions",
        "expectedEdition",
        "sourceVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchingEdition: { type: "integer" },
        verifiedMatchingEdition: { type: "integer" },
        mismatchedEdition: { type: "integer" },
      },
      required: [
        "matchingEdition",
        "verifiedMatchingEdition",
        "mismatchedEdition",
      ],
    },
    ports: {
      inputs: [
        {
          id: "pointLabels",
          label: "Point Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "atlasEditions",
          label: "Atlas Editions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "expectedEdition",
          label: "Expected Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "matchingEdition",
          label: "Matching Edition",
          valueType: { type: "integer" },
        },
        {
          id: "verifiedMatchingEdition",
          label: "Verified Matching Edition",
          valueType: { type: "integer" },
        },
        {
          id: "mismatchedEdition",
          label: "Mismatched Edition",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicAtlasSourceGapTool.execute;
export default publicAtlasSourceGapTool;
