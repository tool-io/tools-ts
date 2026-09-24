import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleParent: string;
  readonly expectedParent: string;
  readonly sampleVisit: string;
  readonly expectedVisit: string;
  readonly specimenId: string;
};
export type Output = {
  readonly parentMatches: boolean;
  readonly visitMatches: boolean;
  readonly sampleKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleParent: { type: "string", maxLength: 8192 },
    expectedParent: { type: "string", maxLength: 8192 },
    sampleVisit: { type: "string", maxLength: 8192 },
    expectedVisit: { type: "string", maxLength: 8192 },
    specimenId: { type: "string", maxLength: 8192 },
  },
  required: [
    "sampleParent",
    "expectedParent",
    "sampleVisit",
    "expectedVisit",
    "specimenId",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMatches: { type: "boolean" },
    visitMatches: { type: "boolean" },
    sampleKey: { type: "string", maxLength: 8192 },
  },
  required: ["parentMatches", "visitMatches", "sampleKey"],
} as const;
/** Compare supplied sample-parent and visit-label references. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sampleParent,
    expectedParent,
    sampleVisit,
    expectedVisit,
    specimenId,
  } = request;
  const compute = (): Output => {
    return {
      parentMatches: sampleParent === expectedParent,
      visitMatches: sampleVisit === expectedVisit,
      sampleKey: JSON.stringify([sampleParent, sampleVisit, specimenId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleParent: "P1",
    expectedParent: "P1",
    sampleVisit: "V2",
    expectedVisit: "V2",
    specimenId: "S1",
  },
  output: {
    parentMatches: true,
    visitMatches: true,
    sampleKey: '["P1","V2","S1"]',
  },
} satisfies ToolExample<Input, Output>;
export const trialSampleParentVisitLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-sample-parent-visit-label",
    title: "Trial Sample Parent Visit Label Tool",
    description: "Compare supplied sample-parent and visit-label references.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleParent: { type: "string", maxLength: 8192 },
        expectedParent: { type: "string", maxLength: 8192 },
        sampleVisit: { type: "string", maxLength: 8192 },
        expectedVisit: { type: "string", maxLength: 8192 },
        specimenId: { type: "string", maxLength: 8192 },
      },
      required: [
        "sampleParent",
        "expectedParent",
        "sampleVisit",
        "expectedVisit",
        "specimenId",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentMatches: { type: "boolean" },
        visitMatches: { type: "boolean" },
        sampleKey: { type: "string", maxLength: 8192 },
      },
      required: ["parentMatches", "visitMatches", "sampleKey"],
    },
    ports: {
      inputs: [
        {
          id: "sampleParent",
          label: "Sample Parent",
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
          id: "sampleVisit",
          label: "Sample Visit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedVisit",
          label: "Expected Visit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "specimenId",
          label: "Specimen Id",
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
          id: "visitMatches",
          label: "Visit Matches",
          valueType: { type: "boolean" },
        },
        { id: "sampleKey", label: "Sample Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = trialSampleParentVisitLabelTool.execute;
export default trialSampleParentVisitLabelTool;
