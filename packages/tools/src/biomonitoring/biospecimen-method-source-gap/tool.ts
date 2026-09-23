import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenIds: readonly string[];
  readonly recordedMethods: readonly string[];
  readonly requiredMethods: readonly string[];
  readonly sourceIds: readonly string[];
};
export type Output = {
  readonly methodMismatches: number;
  readonly missingSources: number;
  readonly sourcedMethodMatches: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recordedMethods: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredMethods: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["specimenIds", "recordedMethods", "requiredMethods", "sourceIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    methodMismatches: { type: "integer" },
    missingSources: { type: "integer" },
    sourcedMethodMatches: { type: "integer" },
  },
  required: ["methodMismatches", "missingSources", "sourcedMethodMatches"],
} as const;
/** Calculate biospecimen method source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenIds, recordedMethods, requiredMethods, sourceIds } = request;
  const compute = (): Output => {
    H.sameLength(specimenIds, recordedMethods);
    H.sameLength(specimenIds, requiredMethods);
    H.sameLength(specimenIds, sourceIds);
    return {
      methodMismatches: recordedMethods.filter(
        (x, i) => x !== requiredMethods[i],
      ).length,
      missingSources: sourceIds.filter((x) => x.length === 0).length,
      sourcedMethodMatches: specimenIds.filter(
        (x, i) =>
          recordedMethods[i] === requiredMethods[i] && sourceIds[i].length > 0,
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenIds: ["a", "b"],
    recordedMethods: ["M1", "M2"],
    requiredMethods: ["M1", "M1"],
    sourceIds: ["s1", ""],
  },
  output: { methodMismatches: 1, missingSources: 1, sourcedMethodMatches: 1 },
} satisfies ToolExample<Input, Output>;
export const biospecimenMethodSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/biospecimen-method-source-gap",
    title: "Biospecimen Method Source Gap Tool",
    description:
      "Calculate biospecimen method source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recordedMethods: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredMethods: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "specimenIds",
        "recordedMethods",
        "requiredMethods",
        "sourceIds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        methodMismatches: { type: "integer" },
        missingSources: { type: "integer" },
        sourcedMethodMatches: { type: "integer" },
      },
      required: ["methodMismatches", "missingSources", "sourcedMethodMatches"],
    },
    ports: {
      inputs: [
        {
          id: "specimenIds",
          label: "Specimen Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "recordedMethods",
          label: "Recorded Methods",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredMethods",
          label: "Required Methods",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceIds",
          label: "Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "methodMismatches",
          label: "Method Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "missingSources",
          label: "Missing Sources",
          valueType: { type: "integer" },
        },
        {
          id: "sourcedMethodMatches",
          label: "Sourced Method Matches",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = biospecimenMethodSourceGapTool.execute;
export default biospecimenMethodSourceGapTool;
