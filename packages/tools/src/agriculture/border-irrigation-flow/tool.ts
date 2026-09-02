import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedBorderSupplyLiters: readonly number[];
  readonly observedBorderSupplySeconds: readonly number[];
  readonly observedIndependentRunoffLiters: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedGrossBorderFlowLitersSecond: number;
  readonly observedRetainedBorderLiters: number;
}>;
const inputFields = [
  {
    id: "observedBorderSupplyLiters",
    label: "Observed border supply liters",
    kind: "numberList",
  },
  {
    id: "observedBorderSupplySeconds",
    label: "Observed border supply seconds",
    kind: "numberList",
  },
  {
    id: "observedIndependentRunoffLiters",
    label: "Observed independent runoff liters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBorderSupplySeconds.forEach((v) =>
    positive(v, "observedBorderSupplySeconds"),
  );
  input.observedBorderSupplyLiters.forEach((v) =>
    nonnegative(v, "observedBorderSupplyLiters"),
  );
  input.observedIndependentRunoffLiters.forEach((v) =>
    nonnegative(v, "observedIndependentRunoffLiters"),
  );
  aligned(
    input.observedBorderSupplyLiters,
    input.observedBorderSupplySeconds,
    "observedBorderSupplyLiters",
  );
  aligned(
    input.observedBorderSupplyLiters,
    input.observedIndependentRunoffLiters,
    "observedBorderSupplyLiters",
  );
  return {
    observedGrossBorderFlowLitersSecond:
      sum(input.observedBorderSupplyLiters) /
      sum(input.observedBorderSupplySeconds),
    observedRetainedBorderLiters:
      sum(input.observedBorderSupplyLiters) -
      sum(input.observedIndependentRunoffLiters),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBorderSupplyLiters: [1000, 2000],
  observedBorderSupplySeconds: [10, 40],
  observedIndependentRunoffLiters: [100, 400],
} satisfies Input;
export const exampleOutput = {
  observedGrossBorderFlowLitersSecond: 60,
  observedRetainedBorderLiters: 2500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/border-irrigation-flow",
  title: "Agriculture Border Irrigation Flow Calculator",
  description:
    "Audit completed border supply time/volume and independent runoff, not rectangular racewayQ or recommended irrigation flow. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGrossBorderFlowLitersSecond",
      label: "Observed gross border flow liters second",
      kind: "number",
    },
    {
      id: "observedRetainedBorderLiters",
      label: "Observed retained border liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBorderSupplyLiters:
        value.observedBorderSupplyLiters as readonly number[],
      observedBorderSupplySeconds:
        value.observedBorderSupplySeconds as readonly number[],
      observedIndependentRunoffLiters:
        value.observedIndependentRunoffLiters as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
