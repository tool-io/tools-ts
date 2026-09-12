import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualSolidsMassFraction: number;
  readonly callerActualSolidDensity: number;
  readonly callerActualLiquidDensity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSolidsMassFraction",
    label: "Actual solids mass fraction",
    kind: "number",
  },
  {
    id: "callerActualSolidDensity",
    label: "Caller actual solid density",
    kind: "number",
  },
  {
    id: "callerActualLiquidDensity",
    label: "Caller actual liquid density",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.actualSolidsMassFraction, "actualSolidsMassFraction");
  positive(input.callerActualSolidDensity, "callerActualSolidDensity");
  positive(input.callerActualLiquidDensity, "callerActualLiquidDensity");
  return {
    value:
      1 /
      (input.actualSolidsMassFraction / input.callerActualSolidDensity +
        (1 - input.actualSolidsMassFraction) / input.callerActualLiquidDensity),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSolidsMassFraction: 0.5,
    callerActualSolidDensity: 2,
    callerActualLiquidDensity: 1,
  },
  output: { result: { value: 1.3333333333333333 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/slurry-density",
  title: "Slurry Density Calculator",
  description:
    "Ideal additive volume two-component slurry bulk density from actual mass solids fraction/densities, no infer mixture compatibility, rheology or solids volume percent.",
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
