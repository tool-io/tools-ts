import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly name: string;
  readonly accordingTo: string;
  readonly conceptId: string;
};
export type Output = { readonly display: string; readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    accordingTo: { type: "string", maxLength: 8192 },
    conceptId: { type: "string", maxLength: 8192 },
  },
  required: ["name", "accordingTo", "conceptId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    display: { type: "string", maxLength: 8192 },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["display", "key"],
} as const;
/** Keep an explicit taxon-name concept attribution separate from its spelling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, accordingTo, conceptId } = request;
  const compute = (): Output => {
    H.domain(name.length > 0 && accordingTo.length > 0 && conceptId.length > 0);
    return {
      display: name + " sec. " + accordingTo,
      key: JSON.stringify([name, accordingTo, conceptId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "Aus bus", accordingTo: "Author 2020", conceptId: "C1" },
  output: {
    display: "Aus bus sec. Author 2020",
    key: '["Aus bus","Author 2020","C1"]',
  },
} satisfies ToolExample<Input, Output>;
export const taxonNameConceptLabelDisambiguatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxon-name-concept-label-disambiguator",
    title: "Taxon Name Concept Label Disambiguator Tool",
    description:
      "Keep an explicit taxon-name concept attribution separate from its spelling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", maxLength: 8192 },
        accordingTo: { type: "string", maxLength: 8192 },
        conceptId: { type: "string", maxLength: 8192 },
      },
      required: ["name", "accordingTo", "conceptId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        display: { type: "string", maxLength: 8192 },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["display", "key"],
    },
    ports: {
      inputs: [
        {
          id: "name",
          label: "Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "accordingTo",
          label: "According To",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "conceptId",
          label: "Concept Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "display", label: "Display", valueType: { type: "string" } },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = taxonNameConceptLabelDisambiguatorTool.execute;
export default taxonNameConceptLabelDisambiguatorTool;
