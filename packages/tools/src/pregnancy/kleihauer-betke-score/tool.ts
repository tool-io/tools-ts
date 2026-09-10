import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyCountedFetalOriginCells: number;
  readonly independentlyAssessedTotalCells: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCountedFetalOriginCells",
    label: "Independently counted fetal origin cells",
    kind: "number",
  },
  {
    id: "independentlyAssessedTotalCells",
    label: "Independently assessed total cells",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.independentlyAssessedTotalCells, "total", 1, 10000000);
  bounded(
    input.independentlyCountedFetalOriginCells,
    "fetal",
    0,
    input.independentlyAssessedTotalCells,
  );
  return {
    observedFetalCellPercent:
      (100 * input.independentlyCountedFetalOriginCells) /
      input.independentlyAssessedTotalCells,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCountedFetalOriginCells: 10,
    independentlyAssessedTotalCells: 1000,
  },
  output: { result: { observedFetalCellPercent: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/kleihauer-betke-score",
  title: "Kleihauer-Betke Score Calculator",
  description:
    "Actual independently qualified Kleihauer-Betke fetal-origin cell fraction. Method specificity, adult Fcells, interpretation and clinical RhIGdecisions external; no blood-volume or dosage inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
