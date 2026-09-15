import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly singular: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "singular", label: "Singular", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.singular,
      {
        child: "children",
        person: "people (persons in some registers)",
        man: "men",
        woman: "women",
        tooth: "teeth",
        foot: "feet",
        mouse: "mice",
        goose: "geese",
        ox: "oxen",
        sheep: "sheep",
        deer: "deer",
      },
      "singular",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { singular: "child" },
  output: { result: { reference: "children" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/plural-rules-irregular-top-english-list-lookup",
  title: "Top Irregular English Plurals List Lookup",
  description:
    "Bounded common irregular English plural reference, sense/register-sensitive and not a full inflection engine.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
