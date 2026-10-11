import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualEqualDurationLevelsDb: readonly number[];
  readonly actualPercentOfTimeExceeded: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualEqualDurationLevelsDb",
    label: "Actual equal duration levels db",
    kind: "numberList",
  },
  {
    id: "actualPercentOfTimeExceeded",
    label: "Actual percent of time exceeded",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (!input.actualEqualDurationLevelsDb.length)
    simpleError("levels", "Actualequal-durationwindows.");
  if (
    input.actualPercentOfTimeExceeded < 0 ||
    input.actualPercentOfTimeExceeded > 100
  )
    simpleError("percent", "0…100percent.");
  const a = [...input.actualEqualDurationLevelsDb].sort((a, b) => a - b),
    i = Math.min(
      a.length - 1,
      Math.max(
        0,
        Math.ceil((1 - input.actualPercentOfTimeExceeded / 100) * a.length) - 1,
      ),
    );
  return { observedNearestRankLnDb: a[i] };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualEqualDurationLevelsDb: [30, 40, 50],
    actualPercentOfTimeExceeded: 50,
  },
  output: { result: { observedNearestRankLnDb: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/percentile-statistical-ln-level",
  title: "Percentile Statistical LN Level Calculator",
  description:
    "Actualequal-windowLnexceededpercent nearest-rankempiricalquantile,not logarithmicmean/genericpercentilewithoutdirection. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { observedNearestRankLnDb: { type: "number" } },
        required: ["observedNearestRankLnDb"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
