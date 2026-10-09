import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly parentSpecimenId: string;
  readonly studyId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    parentSpecimenId: { type: "string", maxLength: 8192, minLength: 1 },
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "parentSpecimenId", "studyId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit specimen-parent relationship by study without inferring sample lineage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, parentSpecimenId, studyId } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(parentSpecimenId.length > 0, "parentSpecimenId");
    H.domain(studyId.length > 0, "studyId");
    return { token: JSON.stringify([specimenId, parentSpecimenId, studyId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "SP17", parentSpecimenId: "PARENT2", studyId: "ST2" },
  output: { token: '["SP17","PARENT2","ST2"]' },
} satisfies ToolExample<Input, Output>;
export const glpSpecimenParentStudyIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "glp",
        "good laboratory practice",
        "research and quality management",
      ],
      keywords: [
        "good laboratory practice",
        "research and quality management",
        "GLP",
      ],
    },
    id: "glp/glp-specimen-parent-study-id",
    title: "GLP Specimen Parent Study ID",
    description:
      "Qualify an explicit specimen-parent relationship by study without inferring sample lineage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        parentSpecimenId: { type: "string", maxLength: 8192, minLength: 1 },
        studyId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "parentSpecimenId", "studyId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentSpecimenId",
          label: "Parent Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "studyId",
          label: "Study Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = glpSpecimenParentStudyIdTool.execute;
export default glpSpecimenParentStudyIdTool;
