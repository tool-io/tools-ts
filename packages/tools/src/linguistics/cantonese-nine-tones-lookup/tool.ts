import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly traditionalCantoneseTone: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  {
    id: "traditionalCantoneseTone",
    label: "Traditional cantonese tone",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.traditionalCantoneseTone,
      {
        "1": "high level; nonchecked",
        "2": "high rising; nonchecked",
        "3": "mid level; nonchecked",
        "4": "low falling/low level; nonchecked",
        "5": "low rising; nonchecked",
        "6": "low level; nonchecked",
        "7": "high checked, corresponds pitch category1",
        "8": "mid checked, corresponds pitch category3",
        "9": "low checked, corresponds pitch category6",
      },
      "traditionalCantoneseTone",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { traditionalCantoneseTone: "7" } satisfies Input;
export const exampleOutput = {
  meaning: "high checked, corresponds pitch category1",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/cantonese-nine-tones-lookup",
  title: "Cantonese Nine Tones Traditional Lookup",
  description:
    "Traditional nine Cantonese tone numbering distinguishes checked syllables, not nine distinct pitch heights or Jyutping1–6identity. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({
      traditionalCantoneseTone: value.traditionalCantoneseTone as string,
    }),
});
export const run = tool.execute;
export default tool;
