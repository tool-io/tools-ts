import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualDivalentIronMoles: number;
  readonly actualMagnesiumMoles: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDivalentIronMoles",
    label: "Actual divalent iron moles",
    kind: "number",
  },
  {
    id: "actualMagnesiumMoles",
    label: "Actual magnesium moles",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualDivalentIronMoles, "Fe2");
  nonnegative(input.actualMagnesiumMoles, "Mg");
  return {
    observedDivalentIronNumber:
      (100 * input.actualDivalentIronMoles) /
      positive(
        input.actualDivalentIronMoles + input.actualMagnesiumMoles,
        "FeMg",
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualDivalentIronMoles: 1, actualMagnesiumMoles: 3 },
  output: { result: { observedDivalentIronNumber: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fe-number",
  title: "Geology Fe Number Calculator",
  description:
    "Explicit 100Fe\u00b2\u207a/(Fe\u00b2\u207a+Mg) molar Fenumber, not total ferric+ferrous mass fraction or existing magnesium number. Oxidation, chemical analysis and molar conversion external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
