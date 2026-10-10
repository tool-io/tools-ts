import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tissueId: string;
  readonly parentSpecimenId: string;
  readonly suppliedSite: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tissueId: { type: "string", maxLength: 8192, minLength: 1 },
    parentSpecimenId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSite: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["tissueId", "parentSpecimenId", "suppliedSite"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link an explicit fish tissue sample to a supplied parent specimen and site label without identifying organisms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tissueId, parentSpecimenId, suppliedSite } = request;
  const compute = (): Output => {
    H.domain(tissueId.length > 0, "tissueId");
    H.domain(parentSpecimenId.length > 0, "parentSpecimenId");
    H.domain(suppliedSite.length > 0, "suppliedSite");
    return {
      token: JSON.stringify([tissueId, parentSpecimenId, suppliedSite]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tissueId: "T17",
    parentSpecimenId: "S4",
    suppliedSite: "fin clip A",
  },
  output: { token: '["T17","S4","fin clip A"]' },
} satisfies ToolExample<Input, Output>;
export const fishFinclipTissueParentLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-finclip-tissue-parent-label",
    title: "Fish Finclip Tissue Parent Label Tool",
    description:
      "Link an explicit fish tissue sample to a supplied parent specimen and site label without identifying organisms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tissueId: { type: "string", maxLength: 8192, minLength: 1 },
        parentSpecimenId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSite: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["tissueId", "parentSpecimenId", "suppliedSite"],
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
          id: "tissueId",
          label: "Tissue Id",
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
          id: "suppliedSite",
          label: "Supplied Site",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fishFinclipTissueParentLabelTool.execute;
export default fishFinclipTissueParentLabelTool;
