import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly labelParent: string;
  readonly expectedParent: string;
  readonly labelAliquot: string;
  readonly recordedAliquot: string;
};
export type Output = {
  readonly parentMatches: boolean;
  readonly aliquotMatches: boolean;
  readonly matches: boolean;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192 },
    labelParent: { type: "string", maxLength: 8192 },
    expectedParent: { type: "string", maxLength: 8192 },
    labelAliquot: { type: "string", maxLength: 8192 },
    recordedAliquot: { type: "string", maxLength: 8192 },
  },
  required: [
    "sampleId",
    "labelParent",
    "expectedParent",
    "labelAliquot",
    "recordedAliquot",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMatches: { type: "boolean" },
    aliquotMatches: { type: "boolean" },
    matches: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["parentMatches", "aliquotMatches", "matches", "key"],
} as const;
/** Check supplied sample-parent and aliquot label references. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sampleId,
    labelParent,
    expectedParent,
    labelAliquot,
    recordedAliquot,
  } = request;
  const compute = (): Output => {
    H.domain(
      [
        sampleId,
        labelParent,
        expectedParent,
        labelAliquot,
        recordedAliquot,
      ].every((x) => x.length > 0),
      "sampleId",
    );
    const parentMatches = labelParent === expectedParent,
      aliquotMatches = labelAliquot === recordedAliquot;
    return {
      parentMatches,
      aliquotMatches,
      matches: parentMatches && aliquotMatches,
      key: JSON.stringify([expectedParent, sampleId, recordedAliquot]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S1",
    labelParent: "P1",
    expectedParent: "P1",
    labelAliquot: "A2",
    recordedAliquot: "A2",
  },
  output: {
    parentMatches: true,
    aliquotMatches: true,
    matches: true,
    key: '["P1","S1","A2"]',
  },
} satisfies ToolExample<Input, Output>;
export const newbornSampleParentLabelCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/newborn-sample-parent-label-check",
    title: "Newborn Sample Parent Label Check Tool",
    description: "Check supplied sample-parent and aliquot label references.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192 },
        labelParent: { type: "string", maxLength: 8192 },
        expectedParent: { type: "string", maxLength: 8192 },
        labelAliquot: { type: "string", maxLength: 8192 },
        recordedAliquot: { type: "string", maxLength: 8192 },
      },
      required: [
        "sampleId",
        "labelParent",
        "expectedParent",
        "labelAliquot",
        "recordedAliquot",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentMatches: { type: "boolean" },
        aliquotMatches: { type: "boolean" },
        matches: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["parentMatches", "aliquotMatches", "matches", "key"],
    },
    ports: {
      inputs: [
        {
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labelParent",
          label: "Label Parent",
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
          id: "labelAliquot",
          label: "Label Aliquot",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedAliquot",
          label: "Recorded Aliquot",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "parentMatches",
          label: "Parent Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "aliquotMatches",
          label: "Aliquot Matches",
          valueType: { type: "boolean" },
        },
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = newbornSampleParentLabelCheckTool.execute;
export default newbornSampleParentLabelCheckTool;
