import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly aliquotId: string;
  readonly declaredParent: string;
  readonly expectedParent: string;
  readonly studyId: string;
  readonly expectedStudy: string;
};
export type Output = {
  readonly parentMatches: boolean;
  readonly studyMatches: boolean;
  readonly aliquotKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192 },
    aliquotId: { type: "string", maxLength: 8192 },
    declaredParent: { type: "string", maxLength: 8192 },
    expectedParent: { type: "string", maxLength: 8192 },
    studyId: { type: "string", maxLength: 8192 },
    expectedStudy: { type: "string", maxLength: 8192 },
  },
  required: [
    "sampleId",
    "aliquotId",
    "declaredParent",
    "expectedParent",
    "studyId",
    "expectedStudy",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMatches: { type: "boolean" },
    studyMatches: { type: "boolean" },
    aliquotKey: { type: "string", maxLength: 8192 },
  },
  required: ["parentMatches", "studyMatches", "aliquotKey"],
} as const;
/** Compare explicit aliquot-parent and study identifiers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sampleId,
    aliquotId,
    declaredParent,
    expectedParent,
    studyId,
    expectedStudy,
  } = request;
  const compute = (): Output => {
    return {
      parentMatches: declaredParent === expectedParent,
      studyMatches: studyId === expectedStudy,
      aliquotKey: JSON.stringify([studyId, sampleId, aliquotId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S1",
    aliquotId: "A1",
    declaredParent: "P1",
    expectedParent: "P1",
    studyId: "ST1",
    expectedStudy: "ST1",
  },
  output: {
    parentMatches: true,
    studyMatches: true,
    aliquotKey: '["ST1","S1","A1"]',
  },
} satisfies ToolExample<Input, Output>;
export const glpStudySampleAliquotParentPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-study-sample-aliquot-parent-pair",
    title: "GLP Study Sample Aliquot Parent Pair Tool",
    description: "Compare explicit aliquot-parent and study identifiers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192 },
        aliquotId: { type: "string", maxLength: 8192 },
        declaredParent: { type: "string", maxLength: 8192 },
        expectedParent: { type: "string", maxLength: 8192 },
        studyId: { type: "string", maxLength: 8192 },
        expectedStudy: { type: "string", maxLength: 8192 },
      },
      required: [
        "sampleId",
        "aliquotId",
        "declaredParent",
        "expectedParent",
        "studyId",
        "expectedStudy",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentMatches: { type: "boolean" },
        studyMatches: { type: "boolean" },
        aliquotKey: { type: "string", maxLength: 8192 },
      },
      required: ["parentMatches", "studyMatches", "aliquotKey"],
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
          id: "aliquotId",
          label: "Aliquot Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "declaredParent",
          label: "Declared Parent",
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
          id: "studyId",
          label: "Study Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedStudy",
          label: "Expected Study",
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
          id: "studyMatches",
          label: "Study Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "aliquotKey",
          label: "Aliquot Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = glpStudySampleAliquotParentPairTool.execute;
export default glpStudySampleAliquotParentPairTool;
