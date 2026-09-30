import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly text: string;
  readonly suppliedMarks: readonly string[];
  readonly decompose: boolean;
};
export type Output = { readonly count: number };
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
    decompose: { type: "boolean" },
  },
  required: ["text", "suppliedMarks", "decompose"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" } },
  required: ["count"],
} as const;
/** Count explicitly supplied transliteration mark code points without transliterating or inferring pronunciation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, suppliedMarks, decompose } = request;
  const compute = (): Output => {
    H.domain(suppliedMarks.every((x) => [...x].length === 1));
    return {
      count: [...(decompose ? text.normalize("NFD") : text)].filter((x) =>
        suppliedMarks.includes(x),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "āḍ", suppliedMarks: ["̄", "̣"], decompose: true },
  output: { count: 2 },
} satisfies ToolExample<Input, Output>;
export const transliterationLetterMarkCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/transliteration-letter-mark-count",
    title: "Transliteration Letter Mark Count Tool",
    description:
      "Count explicitly supplied transliteration mark code points without transliterating or inferring pronunciation.",
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
        decompose: { type: "boolean" },
      },
      required: ["text", "suppliedMarks", "decompose"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" } },
      required: ["count"],
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
        {
          id: "decompose",
          label: "Decompose",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = transliterationLetterMarkCountTool.execute;
export default transliterationLetterMarkCountTool;
