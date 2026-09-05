import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly mandarinTone: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "mandarinTone", label: "Mandarin tone", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.mandarinTone,
      {
        "1": "high level citation tone",
        "2": "rising citation tone",
        "3": "low/dipping citation tone; contextual realization and sandhi differ",
        "4": "falling citation tone",
        "0": "neutral tone, pitch conditioned by context",
      },
      "mandarinTone",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { mandarinTone: "3" } satisfies Input;
export const exampleOutput = {
  meaning:
    "low/dipping citation tone; contextual realization and sandhi differ",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/mandarin-four-tones-neutral-lookup",
  title: "Mandarin Four Tones + Neutral Lookup",
  description:
    "Supported Mandarin citation-tone labels plus neutral0, not automatic tone sandhi or pitch contour extraction. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ mandarinTone: value.mandarinTone as string }),
});
export const run = tool.execute;
export default tool;
