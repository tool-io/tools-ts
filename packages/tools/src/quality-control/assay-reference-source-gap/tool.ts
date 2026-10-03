import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIds: readonly string[];
  readonly referenceIds: readonly string[];
  readonly expectedReferenceIds: readonly string[];
  readonly currentReferenceIds: readonly string[];
};
export type Output = {
  readonly referenceMismatches: number;
  readonly outOfDateReferences: number;
  readonly matchedCurrent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    referenceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    expectedReferenceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    currentReferenceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "sampleIds",
    "referenceIds",
    "expectedReferenceIds",
    "currentReferenceIds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceMismatches: { type: "integer" },
    outOfDateReferences: { type: "integer" },
    matchedCurrent: { type: "integer" },
  },
  required: ["referenceMismatches", "outOfDateReferences", "matchedCurrent"],
} as const;
/** Calculate assay reference source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleIds, referenceIds, expectedReferenceIds, currentReferenceIds } =
    request;
  const compute = (): Output => {
    H.sameLength(sampleIds, referenceIds);
    H.sameLength(sampleIds, expectedReferenceIds);
    return {
      referenceMismatches: referenceIds.filter(
        (x, i) => x !== expectedReferenceIds[i],
      ).length,
      outOfDateReferences: referenceIds.filter(
        (x) => !currentReferenceIds.includes(x),
      ).length,
      matchedCurrent: sampleIds.filter(
        (x, i) =>
          referenceIds[i] === expectedReferenceIds[i] &&
          currentReferenceIds.includes(referenceIds[i]),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleIds: ["a", "b"],
    referenceIds: ["r1", "r2"],
    expectedReferenceIds: ["r1", "r3"],
    currentReferenceIds: ["r1"],
  },
  output: { referenceMismatches: 1, outOfDateReferences: 1, matchedCurrent: 1 },
} satisfies ToolExample<Input, Output>;
export const assayReferenceSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/assay-reference-source-gap",
    title: "Assay Reference Source Gap Tool",
    description:
      "Calculate assay reference source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        referenceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        expectedReferenceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        currentReferenceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "sampleIds",
        "referenceIds",
        "expectedReferenceIds",
        "currentReferenceIds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceMismatches: { type: "integer" },
        outOfDateReferences: { type: "integer" },
        matchedCurrent: { type: "integer" },
      },
      required: [
        "referenceMismatches",
        "outOfDateReferences",
        "matchedCurrent",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sampleIds",
          label: "Sample Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "referenceIds",
          label: "Reference Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "expectedReferenceIds",
          label: "Expected Reference Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "currentReferenceIds",
          label: "Current Reference Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "referenceMismatches",
          label: "Reference Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "outOfDateReferences",
          label: "Out Of Date References",
          valueType: { type: "integer" },
        },
        {
          id: "matchedCurrent",
          label: "Matched Current",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = assayReferenceSourceGapTool.execute;
export default assayReferenceSourceGapTool;
