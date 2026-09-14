import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
  aligned,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualCompleteSeasonDailyMeanC: readonly number[];
  readonly actualCompleteSeasonDailyMaximumC: readonly number[];
  readonly callerIndependentLatitudeDaylengthCoefficient: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCompleteSeasonDailyMeanC",
    label: "Actual complete season daily mean c",
    kind: "numberList",
  },
  {
    id: "actualCompleteSeasonDailyMaximumC",
    label: "Actual complete season daily maximum c",
    kind: "numberList",
  },
  {
    id: "callerIndependentLatitudeDaylengthCoefficient",
    label: "Caller independent latitude daylength coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualCompleteSeasonDailyMeanC,
    input.actualCompleteSeasonDailyMaximumC,
    "completeactualseason",
  );
  positive(input.callerIndependentLatitudeDaylengthCoefficient, "coefficient");
  if (
    input.actualCompleteSeasonDailyMaximumC.some(
      (v, i) => v < input.actualCompleteSeasonDailyMeanC[i],
    )
  )
    simpleError("temperatures", "Actualmax≥mean.");
  return {
    conditionalHuglinIndex:
      input.callerIndependentLatitudeDaylengthCoefficient *
      sum(
        input.actualCompleteSeasonDailyMeanC.map((v, i) =>
          Math.max(
            0,
            (v + input.actualCompleteSeasonDailyMaximumC[i] - 20) / 2,
          ),
        ),
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
    actualCompleteSeasonDailyMeanC: [15, 20],
    actualCompleteSeasonDailyMaximumC: [20, 25],
    callerIndependentLatitudeDaylengthCoefficient: 1,
  },
  output: { result: { conditionalHuglinIndex: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/huglin-heliothermal-index",
  title: "Huglin Heliothermal Index Calculator",
  description:
    "Declared Huglin heliothermal sum k\u00d7\u03a3max(0,((Tmean\u221210)+(Tmax\u221210))/2), actual independently complete applicable growing-season days and latitude/daylength coefficient; not Winkler GDD, wine-quality classification, or guaranteed ripening forecast.",
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
