import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string };
export type Output = {
  readonly leaf: string;
  readonly fragment: string;
  readonly fragmentPresent: boolean;
  readonly duplicateSeparators: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leaf: { type: "string", maxLength: 8192 },
    fragment: { type: "string", maxLength: 8192 },
    fragmentPresent: { type: "boolean" },
    duplicateSeparators: { type: "boolean" },
  },
  required: ["leaf", "fragment", "fragmentPresent", "duplicateSeparators"],
} as const;
/** Separate a supplied leaf reference at its first fragment marker; not a URI or regulatory submission validator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference } = request;
  const compute = (): Output => {
    const i = reference.indexOf("#");
    return {
      leaf: i < 0 ? reference : reference.slice(0, i),
      fragment: i < 0 ? "" : reference.slice(i + 1),
      fragmentPresent: i >= 0,
      duplicateSeparators: i >= 0 && reference.indexOf("#", i + 1) >= 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "leaf.xml#section-2" },
  output: {
    leaf: "leaf.xml",
    fragment: "section-2",
    fragmentPresent: true,
    duplicateSeparators: false,
  },
} satisfies ToolExample<Input, Output>;
export const regulatorySubmissionLeafFragmentFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/regulatory-submission-leaf-fragment-flag",
      title: "Regulatory Submission Leaf Fragment Flag Tool",
      description:
        "Separate a supplied leaf reference at its first fragment marker; not a URI or regulatory submission validator.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string", maxLength: 8192 } },
        required: ["reference"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leaf: { type: "string", maxLength: 8192 },
          fragment: { type: "string", maxLength: 8192 },
          fragmentPresent: { type: "boolean" },
          duplicateSeparators: { type: "boolean" },
        },
        required: [
          "leaf",
          "fragment",
          "fragmentPresent",
          "duplicateSeparators",
        ],
      },
      ports: {
        inputs: [
          {
            id: "reference",
            label: "Reference",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "leaf", label: "Leaf", valueType: { type: "string" } },
          { id: "fragment", label: "Fragment", valueType: { type: "string" } },
          {
            id: "fragmentPresent",
            label: "Fragment Present",
            valueType: { type: "boolean" },
          },
          {
            id: "duplicateSeparators",
            label: "Duplicate Separators",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = regulatorySubmissionLeafFragmentFlagTool.execute;
export default regulatorySubmissionLeafFragmentFlagTool;
