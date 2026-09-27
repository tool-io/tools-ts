import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sample: string;
  readonly recordedParent: string;
  readonly expectedParent: string;
  readonly source: string;
};
export type Output = {
  readonly matches: boolean;
  readonly provenanceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sample: { type: "string", maxLength: 8192 },
    recordedParent: { type: "string", maxLength: 8192 },
    expectedParent: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["sample", "recordedParent", "expectedParent", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    provenanceKey: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "provenanceKey"],
} as const;
/** Compare the supplied parent identifier without resolving an external batch registry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sample, recordedParent, expectedParent, source } = request;
  const compute = (): Output => {
    H.domain(
      sample.length > 0 &&
        recordedParent.length > 0 &&
        expectedParent.length > 0,
    );
    return {
      matches: recordedParent === expectedParent,
      provenanceKey: JSON.stringify([source, recordedParent, sample]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sample: "S1",
    recordedParent: "B1",
    expectedParent: "B1",
    source: "lab",
  },
  output: { matches: true, provenanceKey: '["lab","B1","S1"]' },
} satisfies ToolExample<Input, Output>;
export const foodSampleParentBatchIdentifierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-sample-parent-batch-identifier",
    title: "Food Sample Parent Batch Identifier Tool",
    description:
      "Compare the supplied parent identifier without resolving an external batch registry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sample: { type: "string", maxLength: 8192 },
        recordedParent: { type: "string", maxLength: 8192 },
        expectedParent: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["sample", "recordedParent", "expectedParent", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        provenanceKey: { type: "string", maxLength: 8192 },
      },
      required: ["matches", "provenanceKey"],
    },
    ports: {
      inputs: [
        {
          id: "sample",
          label: "Sample",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedParent",
          label: "Recorded Parent",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedParent",
          label: "Expected Parent",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        {
          id: "provenanceKey",
          label: "Provenance Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodSampleParentBatchIdentifierTool.execute;
export default foodSampleParentBatchIdentifierTool;
