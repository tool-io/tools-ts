import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly isolation: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "isolation", label: "Isolation", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.isolation,
      {
        auto: "does not by itself create a stacking context",
        isolate:
          "creates a stacking context and isolates blending with the outside backdrop",
      },
      "isolation",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { isolation: "isolate" } satisfies Input;
export const exampleOutput = {
  meaning:
    "creates a stacking context and isolates blending with the outside backdrop",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/isolation-stacking-context-fix-note",
  title: "isolation Stacking Context Fix Note",
  description:
    "Supported isolation token effects; does not override ancestor clipping, paint order or unrelated z-index. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ isolation: value.isolation as string }),
});
export const run = tool.execute;
export default tool;
