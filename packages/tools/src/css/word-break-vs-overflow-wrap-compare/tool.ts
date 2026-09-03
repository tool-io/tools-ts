import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly wrapPolicy: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "wrapPolicy", label: "Wrap policy", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.wrapPolicy,
      {
        "word-break:break-all":
          "adds word-break opportunities broadly; does not retain ordinary whole-word overflow policy",
        "overflow-wrap:anywhere":
          "adds emergency opportunities that contribute to min-content size",
        "overflow-wrap:break-word":
          "adds emergency opportunities but they do not contribute to min-content size",
        "word-break:normal": "uses normal language-sensitive word breaking",
      },
      "wrapPolicy",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wrapPolicy: "overflow-wrap:anywhere",
} satisfies Input;
export const exampleOutput = {
  meaning: "adds emergency opportunities that contribute to min-content size",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/word-break-vs-overflow-wrap-compare",
  title: "word-break vs overflow-wrap Compare",
  description:
    "Contrast supported line-break policies and min-content implications, not actual line layout or universal CJK behavior. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ wrapPolicy: value.wrapPolicy as string }),
});
export const run = tool.execute;
export default tool;
