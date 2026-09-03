import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly selectorScope: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "selectorScope", label: "Selector scope", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.selectorScope,
      {
        document: "ordinary document selectors do not pierce a shadow tree",
        shadow: "ordinary shadow selectors apply within their shadow tree",
        host: "host pseudo-class targets the shadow host in shadow stylesheet context",
        slotted:
          "slotted pseudo-element targets assigned slotted elements, not arbitrary deeper descendants",
        part: "part pseudo-element can target explicitly exposed shadow parts",
      },
      "selectorScope",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { selectorScope: "slotted" } satisfies Input;
export const exampleOutput = {
  meaning:
    "slotted pseudo-element targets assigned slotted elements, not arbitrary deeper descendants",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/shadow-dom-style-scoping-note",
  title: "Shadow DOM Style Scoping Note",
  description:
    "Supported ShadowDOM style scope mechanisms, not assumed all styles/inheritance stopped at shadow boundary. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ selectorScope: value.selectorScope as string }),
});
export const run = tool.execute;
export default tool;
