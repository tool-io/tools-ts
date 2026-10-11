import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dossierId: string;
  readonly moduleText: string;
  readonly sectionText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dossierId: { type: "string", maxLength: 8192, minLength: 1 },
    moduleText: { type: "string", maxLength: 8192, minLength: 1 },
    sectionText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["dossierId", "moduleText", "sectionText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve supplied dossier module and section wording without asserting regulatory compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dossierId, moduleText, sectionText } = request;
  const compute = (): Output => {
    H.domain(dossierId.length > 0, "dossierId");
    H.domain(moduleText.length > 0, "moduleText");
    H.domain(sectionText.length > 0, "sectionText");
    return { token: JSON.stringify([dossierId, moduleText, sectionText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dossierId: "DOS17",
    moduleText: "Module 3",
    sectionText: "Section 2",
  },
  output: { token: '["DOS17","Module 3","Section 2"]' },
} satisfies ToolExample<Input, Output>;
export const dossierModuleSectionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "regulatory-affairs",
        "regulatory affairs",
        "research and quality management",
      ],
      keywords: ["regulatory affairs", "research and quality management"],
    },
    id: "regulatory-affairs/dossier-module-section-label",
    title: "Dossier Module Section Label",
    description:
      "Preserve supplied dossier module and section wording without asserting regulatory compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dossierId: { type: "string", maxLength: 8192, minLength: 1 },
        moduleText: { type: "string", maxLength: 8192, minLength: 1 },
        sectionText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["dossierId", "moduleText", "sectionText"],
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
          id: "dossierId",
          label: "Dossier Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "moduleText",
          label: "Module Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sectionText",
          label: "Section Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dossierModuleSectionLabelTool.execute;
export default dossierModuleSectionLabelTool;
