import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredNewSnowDepth: number;
  readonly actualMatchedLiquidEquivalentDepth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredNewSnowDepth",
    label: "Actual measured new snow depth",
    kind: "number",
  },
  {
    id: "actualMatchedLiquidEquivalentDepth",
    label: "Actual matched liquid equivalent depth",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualMeasuredNewSnowDepth, "actualMeasuredNewSnowDepth");
  positive(
    input.actualMatchedLiquidEquivalentDepth,
    "actualMatchedLiquidEquivalentDepth",
  );
  return {
    value:
      input.actualMeasuredNewSnowDepth /
      input.actualMatchedLiquidEquivalentDepth,
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
    actualMeasuredNewSnowDepth: 10,
    actualMatchedLiquidEquivalentDepth: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/snowfall-liquid-ratio",
  title: "Snowfall to Liquid Ratio Calculator",
  description:
    "Actualnew-snow/liquidequivalentratio,not assumeuniversal10:1or depth-density profile. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
