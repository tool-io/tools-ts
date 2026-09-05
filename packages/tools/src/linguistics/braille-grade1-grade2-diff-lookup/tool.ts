import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly brailleMode: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "brailleMode", label: "Braille mode", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.brailleMode,
      {
        uncontracted:
          "writes words without word/letter-group contractions; exact sign conventions depend on code",
        contracted:
          "uses code-specific word or letter-group contractions; not universal across languages",
      },
      "brailleMode",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { brailleMode: "contracted" } satisfies Input;
export const exampleOutput = {
  meaning:
    "uses code-specific word or letter-group contractions; not universal across languages",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/braille-grade1-grade2-diff-lookup",
  title: "Braille Grade 1 vs Grade 2 Diff Lookup",
  description:
    "Contrast caller selected uncontracted/contracted braille, not visual translation or automatic universal Grade2code. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ brailleMode: value.brailleMode as string }),
});
export const run = tool.execute;
export default tool;
