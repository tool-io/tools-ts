import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  money,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualTotalWageredMinorUnits: number;
  readonly callerApplicableExpectedHouseEdgeFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTotalWageredMinorUnits",
    label: "Actual total wagered minor units",
    kind: "number",
  },
  {
    id: "callerApplicableExpectedHouseEdgeFraction",
    label: "Caller applicable expected house edge fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualTotalWageredMinorUnits,
    "actualTotalWageredMinorUnits",
  );
  fraction(
    input.callerApplicableExpectedHouseEdgeFraction,
    "callerApplicableExpectedHouseEdgeFraction",
  );
  money(input.actualTotalWageredMinorUnits, "wager");
  return {
    value:
      input.actualTotalWageredMinorUnits *
      input.callerApplicableExpectedHouseEdgeFraction,
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
    actualTotalWageredMinorUnits: 100,
    callerApplicableExpectedHouseEdgeFraction: 0.05,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/house-edge-loss",
  title: "Expected Casino Loss House Edge Calculator",
  description:
    "Expectedlossunder independently applicablehouseedge\u00d7TOTALturnover,not startingbankroll,mortality/risk or guaranteedactualloss.",
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
