import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly removedMassGrams: number;
  readonly initialMassGrams: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "removedMassGrams", label: "Removed mass grams", kind: "number" },
  { id: "initialMassGrams", label: "Initial mass grams", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.removedMassGrams, "removed");
  positive(i.initialMassGrams, "initial");
  if (i.removedMassGrams > i.initialMassGrams)
    simpleError("removed", "Removed mass exceeds initial mass.");
  return { heuristicExceeded: i.removedMassGrams / i.initialMassGrams > 1 / 3 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { removedMassGrams: 40, initialMassGrams: 100 },
  output: { result: { heuristicExceeded: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/herb-one-third-harvest-rule-checker",
  title: "Herb One Third Harvest Rule Checker",
  description:
    "Observed harvest fraction compared with illustrative one-third heuristic; not a species-specific recovery guarantee.",
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
