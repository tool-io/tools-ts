import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resourceTitle: string;
  readonly licenseId: string;
  readonly creatorCredit: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resourceTitle: { type: "string", maxLength: 8192 },
    licenseId: { type: "string", maxLength: 8192 },
    creatorCredit: { type: "string", maxLength: 8192 },
  },
  required: ["resourceTitle", "licenseId", "creatorCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Format explicit lesson-resource credit and license fields without verifying reuse rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resourceTitle, licenseId, creatorCredit } = request;
  const compute = (): Output => {
    H.domain(
      resourceTitle.length > 0 &&
        licenseId.length > 0 &&
        creatorCredit.length > 0,
      "resourceTitle",
    );
    return {
      tag: resourceTitle + " — " + creatorCredit + " [" + licenseId + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resourceTitle: "Lesson diagram",
    licenseId: "CC-BY-4.0",
    creatorCredit: "A. Teacher",
  },
  output: { tag: "Lesson diagram — A. Teacher [CC-BY-4.0]" },
} satisfies ToolExample<Input, Output>;
export const lessonResourceLicenseTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/lesson-resource-license-tag",
    title: "Lesson Resource License Tag Tool",
    description:
      "Format explicit lesson-resource credit and license fields without verifying reuse rights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resourceTitle: { type: "string", maxLength: 8192 },
        licenseId: { type: "string", maxLength: 8192 },
        creatorCredit: { type: "string", maxLength: 8192 },
      },
      required: ["resourceTitle", "licenseId", "creatorCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "resourceTitle",
          label: "Resource Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "licenseId",
          label: "License Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "creatorCredit",
          label: "Creator Credit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = lessonResourceLicenseTagTool.execute;
export default lessonResourceLicenseTagTool;
