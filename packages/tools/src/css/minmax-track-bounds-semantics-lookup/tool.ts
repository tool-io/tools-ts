import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly maximumToken: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "maximumToken", label: "Maximum token", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.maximumToken,
      {
        fixed:
          "maximum cannot shrink below the minimum; used max is at least min",
        fr: "flexible maximum shares remaining space after intrinsic minimum resolution",
        auto: "automatic maximum participates in eligible alignment stretching",
      },
      "maximumToken",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { maximumToken: "fr" } satisfies Input;
export const exampleOutput = {
  meaning:
    "flexible maximum shares remaining space after intrinsic minimum resolution",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/minmax-track-bounds-semantics-lookup",
  title: "minmax() Track Bounds Semantics Lookup",
  description:
    "Resolve supported minmax maximum-bound semantics; caller independently establishes valid minimum (fr minimum unsupported). Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ maximumToken: value.maximumToken as string }),
});
export const run = tool.execute;
export default tool;
