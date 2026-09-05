import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly vietnameseNorthernTone: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  {
    id: "vietnameseNorthernTone",
    label: "Vietnamese northern tone",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.vietnameseNorthernTone,
      {
        ngang: "level; unmarked",
        huyền: "falling; grave mark",
        sắc: "rising; acute mark",
        hỏi: "dipping; hook mark",
        ngã: "broken rising; tilde mark",
        nặng: "low/glottalized; dot below",
      },
      "vietnameseNorthernTone",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { vietnameseNorthernTone: "hỏi" } satisfies Input;
export const exampleOutput = { meaning: "dipping; hook mark" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/vietnamese-six-tones-lookup",
  title: "Vietnamese Six Tones Lookup",
  description:
    "Northern six-tone orthographic label descriptors; phonetic realizations vary and other varieties can merge labels. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({
      vietnameseNorthernTone: value.vietnameseNorthernTone as string,
    }),
});
export const run = tool.execute;
export default tool;
