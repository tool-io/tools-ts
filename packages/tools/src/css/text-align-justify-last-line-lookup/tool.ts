import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly lastLinePolicy: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "lastLinePolicy", label: "Last line policy", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.lastLinePolicy,
      {
        auto: "last line uses start alignment under text-align:justify",
        justify: "last line is eligible for justification",
        start: "last line aligned to logical start",
        center: "last line centered",
        end: "last line aligned to logical end",
      },
      "lastLinePolicy",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { lastLinePolicy: "auto" } satisfies Input;
export const exampleOutput = {
  meaning: "last line uses start alignment under text-align:justify",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/text-align-justify-last-line-lookup",
  title: "text-align:justify Last-Line Behavior",
  description:
    "Supported text-align-last behavior under explicitly justified main text, not bidi-order or actual space distribution. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ lastLinePolicy: value.lastLinePolicy as string }),
});
export const run = tool.execute;
export default tool;
