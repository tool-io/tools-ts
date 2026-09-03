import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly changedProperty: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "changedProperty", label: "Changed property", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.changedProperty,
      {
        width: "potential layout and paint invalidation",
        height: "potential layout and paint invalidation",
        margin: "potential layout and paint invalidation",
        color: "potential paint invalidation",
        "background-color": "potential paint invalidation",
        transform:
          "potential composite update when independently promoted; paint may still be needed",
        opacity:
          "potential composite update when independently promoted; paint may still be needed",
      },
      "changedProperty",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { changedProperty: "width" } satisfies Input;
export const exampleOutput = {
  meaning: "potential layout and paint invalidation",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/reflow-vs-repaint-trigger-table",
  title: "Reflow vs Repaint Trigger Table",
  description:
    "Conservative invalidation categories for supported property changes, not universal pipeline cost or actual browser trace. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ changedProperty: value.changedProperty as string }),
});
export const run = tool.execute;
export default tool;
