import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly shadowKind: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "shadowKind", label: "Shadow kind", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.shadowKind,
      {
        "box-shadow":
          "shadow derives from border-box silhouette and can be inset",
        "drop-shadow":
          "filter shadow derives from rendered input alpha silhouette, no inset or spread parameter",
      },
      "shadowKind",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { shadowKind: "drop-shadow" } satisfies Input;
export const exampleOutput = {
  meaning:
    "filter shadow derives from rendered input alpha silhouette, no inset or spread parameter",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/drop-shadow-vs-box-shadow-diff-lookup",
  title: "filter drop-shadow vs box-shadow Diff",
  description:
    "Supported shadow silhouette semantics, not matching blur-radius kernels or visual equivalence. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ shadowKind: value.shadowKind as string }),
});
export const run = tool.execute;
export default tool;
