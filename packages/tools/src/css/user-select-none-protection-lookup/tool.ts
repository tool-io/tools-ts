import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly userSelect: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "userSelect", label: "User select", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.userSelect,
      {
        none: "excludes user selection in its used-value context; does not protect source or prevent copying by other means",
        text: "allows ordinary text selection",
        all: "selection treats element content atomically",
        auto: "used selection behavior depends on parent and element context",
      },
      "userSelect",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { userSelect: "none" } satisfies Input;
export const exampleOutput = {
  meaning:
    "excludes user selection in its used-value context; does not protect source or prevent copying by other means",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/user-select-none-protection-lookup",
  title: "user-select:none Protection Lookup",
  description:
    "Supported user-select semantics, no DRM or confidential-content protection. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ userSelect: value.userSelect as string }),
});
export const run = tool.execute;
export default tool;
