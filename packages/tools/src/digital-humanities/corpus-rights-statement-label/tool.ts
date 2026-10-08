import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly corpusId: string;
  readonly rightsWording: string;
  readonly sourceReference: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    corpusId: { type: "string", maxLength: 8192, minLength: 1 },
    rightsWording: { type: "string", maxLength: 8192, minLength: 1 },
    sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["corpusId", "rightsWording", "sourceReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve literal corpus rights wording with an explicit source reference without determining copyright or reuse permission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { corpusId, rightsWording, sourceReference } = request;
  const compute = (): Output => {
    H.domain(
      corpusId.length > 0 &&
        rightsWording.length > 0 &&
        sourceReference.length > 0,
      "corpusId",
    );
    return {
      label:
        corpusId +
        "; rights=" +
        JSON.stringify(rightsWording) +
        " [" +
        sourceReference +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    corpusId: "C17",
    rightsWording: "Reuse under stated terms",
    sourceReference: "licence record 3",
  },
  output: {
    label: 'C17; rights="Reuse under stated terms" [licence record 3]',
  },
} satisfies ToolExample<Input, Output>;
export const corpusRightsStatementLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["digital-humanities", "digital humanities", "humanities"],
      keywords: ["digital humanities", "humanities"],
    },
    id: "digital-humanities/corpus-rights-statement-label",
    title: "Corpus Rights Statement Label",
    description:
      "Preserve literal corpus rights wording with an explicit source reference without determining copyright or reuse permission.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        corpusId: { type: "string", maxLength: 8192, minLength: 1 },
        rightsWording: { type: "string", maxLength: 8192, minLength: 1 },
        sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["corpusId", "rightsWording", "sourceReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "corpusId",
          label: "Corpus Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rightsWording",
          label: "Rights Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceReference",
          label: "Source Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = corpusRightsStatementLabelTool.execute;
export default corpusRightsStatementLabelTool;
