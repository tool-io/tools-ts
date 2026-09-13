import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, splitMinor } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualEquityPoolMinorUnits: number;
  readonly callerContractVerifiedJvEquityIntegerWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEquityPoolMinorUnits",
    label: "Actual equity pool minor units",
    kind: "number",
  },
  {
    id: "callerContractVerifiedJvEquityIntegerWeights",
    label: "Caller contract verified jv equity integer weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    actualAllocatedEquityMinorUnits: splitMinor(
      input.actualEquityPoolMinorUnits,
      input.callerContractVerifiedJvEquityIntegerWeights,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualEquityPoolMinorUnits: 100,
    callerContractVerifiedJvEquityIntegerWeights: [1, 2],
  },
  output: { result: { actualAllocatedEquityMinorUnits: [33, 67] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/jv-equity-split",
  title: "Joint Venture Equity Split Calculator",
  description:
    "Actual JV contract equity pool apportioned by externally verified nonnegative integers hares, largest-remainder allocation exact minor units, stable order residual ties. Not choose equity terms or infer ownership rights.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
