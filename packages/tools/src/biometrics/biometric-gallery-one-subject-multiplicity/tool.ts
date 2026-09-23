import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly subjectIds: readonly string[];
  readonly templateIds: readonly string[];
  readonly targetSubject: string;
};
export type Output = {
  readonly templateIds: readonly string[];
  readonly distinctTemplates: number;
  readonly duplicateTemplateIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subjectIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    templateIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targetSubject: { type: "string", maxLength: 8192 },
  },
  required: ["subjectIds", "templateIds", "targetSubject"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    templateIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    distinctTemplates: { type: "integer" },
    duplicateTemplateIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["templateIds", "distinctTemplates", "duplicateTemplateIndices"],
} as const;
/** Count explicit template references for one supplied subject without identifying a person. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subjectIds, templateIds, targetSubject } = request;
  const compute = (): Output => {
    H.sameLength(subjectIds, templateIds);
    const selected = templateIds.filter(
        (_, i) => subjectIds[i] === targetSubject,
      ),
      seen = new Set<string>(),
      duplicateTemplateIndices: number[] = [];
    templateIds.forEach((id, i) => {
      if (subjectIds[i] === targetSubject) {
        if (seen.has(id)) duplicateTemplateIndices.push(i);
        seen.add(id);
      }
    });
    return {
      templateIds: [...new Set(selected)],
      distinctTemplates: seen.size,
      duplicateTemplateIndices,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    subjectIds: ["A", "A", "B", "A"],
    templateIds: ["T1", "T2", "T1", "T1"],
    targetSubject: "A",
  },
  output: {
    templateIds: ["T1", "T2"],
    distinctTemplates: 2,
    duplicateTemplateIndices: [3],
  },
} satisfies ToolExample<Input, Output>;
export const biometricGalleryOneSubjectMultiplicityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biometrics/biometric-gallery-one-subject-multiplicity",
      title: "Biometric Gallery One Subject Multiplicity Tool",
      description:
        "Count explicit template references for one supplied subject without identifying a person.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          subjectIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          templateIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          targetSubject: { type: "string", maxLength: 8192 },
        },
        required: ["subjectIds", "templateIds", "targetSubject"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          templateIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          distinctTemplates: { type: "integer" },
          duplicateTemplateIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: [
          "templateIds",
          "distinctTemplates",
          "duplicateTemplateIndices",
        ],
      },
      ports: {
        inputs: [
          {
            id: "subjectIds",
            label: "Subject Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "templateIds",
            label: "Template Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "targetSubject",
            label: "Target Subject",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "templateIds",
            label: "Template Ids",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "distinctTemplates",
            label: "Distinct Templates",
            valueType: { type: "integer" },
          },
          {
            id: "duplicateTemplateIndices",
            label: "Duplicate Template Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = biometricGalleryOneSubjectMultiplicityTool.execute;
export default biometricGalleryOneSubjectMultiplicityTool;
