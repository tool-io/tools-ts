import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly text: string;
  readonly suppliedMarks: readonly string[];
};
export type Output = { readonly marks: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    suppliedMarks: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["text", "suppliedMarks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { marks: { type: "integer" } },
  required: ["marks"],
} as const;
/** Count explicitly designated syllable-mark code points rather than infer syllable boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, suppliedMarks } = request;
  const compute = (): Output => {
    H.domain(suppliedMarks.every((x) => [...x].length === 1));
    return { marks: [...text].filter((x) => suppliedMarks.includes(x)).length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "a·b·c", suppliedMarks: ["·"] },
  output: { marks: 2 },
} satisfies ToolExample<Input, Output>;
export const publicTextSyllableMarkCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/public-text-syllable-mark-count",
    title: "Public Text Syllable Mark Count Tool",
    description:
      "Count explicitly designated syllable-mark code points rather than infer syllable boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        suppliedMarks: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["text", "suppliedMarks"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { marks: { type: "integer" } },
      required: ["marks"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedMarks",
          label: "Supplied Marks",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "marks", label: "Marks", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = publicTextSyllableMarkCountTool.execute;
export default publicTextSyllableMarkCountTool;
