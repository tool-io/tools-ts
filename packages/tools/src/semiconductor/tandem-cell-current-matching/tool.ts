import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredSubcellCurrentDensities: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredSubcellCurrentDensities",
    label: "Independently measured subcell current densities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentlyMeasuredSubcellCurrentDensities.length)
    simpleError("cells", "Actual nonempty series subcell inventory.");
  input.independentlyMeasuredSubcellCurrentDensities.forEach((v) =>
    nonnegative(v, "currentdensity"),
  );
  const m = Math.min(...input.independentlyMeasuredSubcellCurrentDensities);
  return {
    conditionalSeriesLimitingCurrentDensity: m,
    limitingSubcellIndices:
      input.independentlyMeasuredSubcellCurrentDensities.flatMap((v, i) =>
        v === m ? [i] : [],
      ),
    signedSubcellExcessCurrentDensities:
      input.independentlyMeasuredSubcellCurrentDensities.map((v) => v - m),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyMeasuredSubcellCurrentDensities: [10, 12, 10] },
  output: {
    result: {
      conditionalSeriesLimitingCurrentDensity: 10,
      limitingSubcellIndices: [0, 2],
      signedSubcellExcessCurrentDensities: [0, 2, 0],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/tandem-cell-current-matching",
  title: "Semiconductor Tandem Cell Current Matching Calculator",
  description:
    "Ideal equal-area series tandem independent subcell current constraint; all tied limiting cells retained. No four-terminal sum, bypass/dynamic redistribution or independently predicted tandem JVcurve.",
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
