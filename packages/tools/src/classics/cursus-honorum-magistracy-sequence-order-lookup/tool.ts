import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly annotatedMagistracies: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "annotatedMagistracies",
    label: "Annotated magistracies",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const order = ["quaestor", "aedile-or-tribune", "praetor", "consul"];
  if (input.annotatedMagistracies.some((v) => !order.includes(v)))
    simpleError("office", "Explicit supported teaching-sequence offices only.");
  const indices = input.annotatedMagistracies.map((v) => order.indexOf(v));
  return {
    descendingOrderIndices: indices.flatMap((v, i) =>
      i && v < indices[i - 1] ? [i] : [],
    ),
    missingTypicalStages: order.filter(
      (v) => !input.annotatedMagistracies.includes(v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { annotatedMagistracies: ["quaestor", "praetor", "consul"] },
  output: {
    result: {
      descendingOrderIndices: [],
      missingTypicalStages: ["aedile-or-tribune"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/cursus-honorum-magistracy-sequence-order-lookup",
  title: "Cursus Honorum Magistracy Sequence Order Lookup",
  description:
    "Audit a limited late-Republic classroom cursus sequence; omissions and repeat offices preserved, not mandatory universal eligibility, age rules or exceptional careers.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
