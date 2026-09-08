import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, toothMap } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyIdentifiedFdiTooth: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyIdentifiedFdiTooth",
    label: "Independently identified fdi tooth",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    universalTooth: pick(
      input.independentlyIdentifiedFdiTooth,
      toothMap,
      "FDI",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyIdentifiedFdiTooth: "11" },
  output: { result: { universalTooth: "8" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/tooth-numbering-fdi-to-universal",
  title: "FDI to Universal Numbering Converter",
  description:
    "Convert one actual FDI permanent11\u201348or primary51\u201385to the standard USUniversal1\u201332/A\u2013Tdesignation. Anatomical identification external; not treatment selection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
