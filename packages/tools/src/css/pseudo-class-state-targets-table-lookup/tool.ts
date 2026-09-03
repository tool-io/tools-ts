import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly pseudoClass: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "pseudoClass", label: "Pseudo class", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.pseudoClass,
      {
        hover: "element designated by pointer hover",
        active: "element being activated",
        focus: "element has input focus",
        "focus-visible":
          "focused element when UA determines focus indication should be visible",
        checked: "selected radio, checkbox or option state",
        disabled: "supported element disabled by document semantics",
      },
      "pseudoClass",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { pseudoClass: "focus-visible" } satisfies Input;
export const exampleOutput = {
  meaning:
    "focused element when UA determines focus indication should be visible",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/pseudo-class-state-targets-table-lookup",
  title: "Pseudo-Class State Targets Table",
  description:
    "Supported pseudo-class state semantics; does not compute matching state from selector text. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ pseudoClass: value.pseudoClass as string }),
});
export const run = tool.execute;
export default tool;
