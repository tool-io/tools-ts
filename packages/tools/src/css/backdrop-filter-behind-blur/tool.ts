import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly filterKind: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "filterKind", label: "Filter kind", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.filterKind,
      {
        "backdrop-filter":
          "filters sampled backdrop behind element; transparent coverage can reveal result",
        filter: "filters element rendered group including descendants",
      },
      "filterKind",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { filterKind: "backdrop-filter" } satisfies Input;
export const exampleOutput = {
  meaning:
    "filters sampled backdrop behind element; transparent coverage can reveal result",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/backdrop-filter-behind-blur",
  title: "backdrop-filter Behind-Element Blur",
  description:
    "Separate backdrop sampling from element filter, no browser support/stacking/backdrop-root resolution implied. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ filterKind: value.filterKind as string }),
});
export const run = tool.execute;
export default tool;
