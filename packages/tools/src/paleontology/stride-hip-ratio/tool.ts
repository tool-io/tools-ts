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
  readonly actualTrackwayStrideLength: number;
  readonly actualIndependentHipHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTrackwayStrideLength",
    label: "Actual trackway stride length",
    kind: "number",
  },
  {
    id: "actualIndependentHipHeight",
    label: "Actual independent hip height",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualTrackwayStrideLength, "actualTrackwayStrideLength");
  positive(input.actualIndependentHipHeight, "actualIndependentHipHeight");
  return {
    value: input.actualTrackwayStrideLength / input.actualIndependentHipHeight,
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
  input: { actualTrackwayStrideLength: 4, actualIndependentHipHeight: 2 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/stride-hip-ratio",
  title: "Stride Length to Hip Height Ratio Calculator",
  description:
    "ActualFULLstride/independentlyhipheightdimensionlessratio,not singlestepstrideconversionor infergaitfromuniversalcutoff. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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
