import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedCurrentGestationalDays: number;
  readonly callerChosenGestationalEndpointDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedCurrentGestationalDays",
    label: "Independently established current gestational days",
    kind: "number",
  },
  {
    id: "callerChosenGestationalEndpointDays",
    label: "Caller chosen gestational endpoint days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.independentlyEstablishedCurrentGestationalDays,
    "current",
    0,
    450,
  );
  bounded(input.callerChosenGestationalEndpointDays, "endpoint", 0, 450);
  const d =
    input.callerChosenGestationalEndpointDays -
    input.independentlyEstablishedCurrentGestationalDays;
  return {
    signedCompleteWeeksToCallerEndpoint: Math.trunc(d / 7),
    signedAdditionalDaysToCallerEndpoint: d % 7,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedCurrentGestationalDays: 100,
    callerChosenGestationalEndpointDays: 280,
  },
  output: {
    result: {
      signedCompleteWeeksToCallerEndpoint: 25,
      signedAdditionalDaysToCallerEndpoint: 5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/weeks-remaining",
  title: "Weeks Remaining Calculator",
  description:
    "Signed whole-week/remainder bookkeeping to a caller independently chosen gestational endpoint. Not forecast birth date, required remaining pregnancy or medical decision.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
