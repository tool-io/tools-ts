import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly whiteSpace: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "whiteSpace", label: "White space", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.whiteSpace,
      {
        normal: "collapse spaces and segment breaks; allow wrapping",
        nowrap: "collapse spaces and segment breaks; suppress wrapping",
        pre: "preserve spaces and segment breaks; suppress wrapping",
        "pre-wrap": "preserve spaces and segment breaks; allow wrapping",
        "pre-line": "collapse spaces, preserve segment breaks; allow wrapping",
        "break-spaces":
          "preserve spaces and segment breaks, wrap opportunities after preserved spaces",
      },
      "whiteSpace",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { whiteSpace: "pre-line" } satisfies Input;
export const exampleOutput = {
  meaning: "collapse spaces, preserve segment breaks; allow wrapping",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/white-space-collapse-behavior-table",
  title: "white-space Collapse Behavior Table",
  description:
    "Supported legacy white-space shorthand behavior, not context-dependent text-transform/line-breaking computation. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ whiteSpace: value.whiteSpace as string }),
});
export const run = tool.execute;
export default tool;
