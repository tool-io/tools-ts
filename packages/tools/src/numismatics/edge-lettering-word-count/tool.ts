import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, tokenInventory } from "../batch45-shared.js";
export type Input = Readonly<{
  readonly independentlyTranscribedEdgeLettering: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyTranscribedEdgeLettering",
    label: "Independently transcribed edge lettering",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    whitespaceDelimitedTokenCount: tokenInventory(
      input.independentlyTranscribedEdgeLettering,
    ).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyTranscribedEdgeLettering: "E PLURIBUS UNUM" },
  output: { result: { whitespaceDelimitedTokenCount: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/edge-lettering-word-count",
  title: "Edge Lettering Word Count Tool",
  description:
    "Count whitespace-delimited tokens in independently transcribed edge lettering, capped8192UTF16 units; punctuation-only tokens count. Not OCR, language-aware word segmentation or issue attribution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
