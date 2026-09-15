import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch52-shared.js";
export type Input = Readonly<{ readonly shelfmark: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "shelfmark", label: "Shelfmark", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    matchesExplicitThreePartShape:
      /^[A-Za-z][A-Za-z .-]{0,63} \/ [A-Za-z0-9][A-Za-z0-9 .-]{0,63} \/ [A-Za-z0-9][A-Za-z0-9 .-]{0,31}$(?![\s\S])/.test(
        i.shelfmark,
      ),
    catalogExistenceVerified: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { shelfmark: "Library / Collection / MS 12" },
  output: {
    result: {
      matchesExplicitThreePartShape: true,
      catalogExistenceVerified: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleography/shelfmark-validator",
  title: "Manuscript Shelfmark Validator (library-collection-folio format)",
  description:
    "Screen explicitly declared library / collection / item shape only; institutions do not share a universal shelfmark grammar.",
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
