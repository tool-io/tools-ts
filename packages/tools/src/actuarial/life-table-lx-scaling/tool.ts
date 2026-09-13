import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyEstablishedSurvivors: readonly number[];
  readonly actualNewRadix: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyEstablishedSurvivors",
    label: "Actual independently established survivors",
    kind: "numberList",
  },
  { id: "actualNewRadix", label: "Actual new radix", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualNewRadix, "radix");
  if (!input.actualIndependentlyEstablishedSurvivors.length)
    simpleError("lx", "Actualsurvivors.");
  const r = positive(
    input.actualIndependentlyEstablishedSurvivors[0],
    "oldradix",
  );
  input.actualIndependentlyEstablishedSurvivors.forEach((v, i) => {
    nonnegative(v, "lx");
    if (i && v > input.actualIndependentlyEstablishedSurvivors[i - 1])
      simpleError("lx", "Nonincreasing.");
  });
  return {
    scaledLifeTableLx: input.actualIndependentlyEstablishedSurvivors.map(
      (v) => (v * input.actualNewRadix) / r,
    ),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIndependentlyEstablishedSurvivors: [10, 8, 0],
    actualNewRadix: 100,
  },
  output: { result: { scaledLifeTableLx: [100, 80, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/life-table-lx-scaling",
  title: "Life Table Lx Scaling Calculator",
  description:
    "Lowercasel_xradixrescalingNOTuppercasepersonyearsL_x,actualtablevaluesnonincreasing. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
