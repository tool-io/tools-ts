import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  finite,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDryBulbC: readonly number[];
  readonly observedDewPointC: readonly number[];
  readonly callerResetDayFlags: readonly number[];
  readonly callerOpeningNesterovIndex: number;
}>;
export type Output = Readonly<{
  readonly nesterovDailyIndex: readonly number[];
}>;
const inputFields = [
  { id: "observedDryBulbC", label: "Observed dry bulb c", kind: "numberList" },
  {
    id: "observedDewPointC",
    label: "Observed dew point c",
    kind: "numberList",
  },
  {
    id: "callerResetDayFlags",
    label: "Caller reset day flags",
    kind: "numberList",
  },
  {
    id: "callerOpeningNesterovIndex",
    label: "Caller opening nesterov index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerOpeningNesterovIndex, "callerOpeningNesterovIndex");
  binary(input.callerResetDayFlags, "callerResetDayFlags");
  aligned(input.observedDryBulbC, input.observedDewPointC, "observedDryBulbC");
  aligned(
    input.observedDryBulbC,
    input.callerResetDayFlags,
    "observedDryBulbC",
  );
  let cumulative = input.callerOpeningNesterovIndex;
  return {
    nesterovDailyIndex: input.observedDryBulbC.map((v, i) => {
      if (v < 0 || input.observedDewPointC[i] > v)
        simpleError(
          "weather",
          "Nonnegative air temperature and dew point≤air on this Nesterov branch.",
        );
      if (input.callerResetDayFlags[i]) cumulative = 0;
      cumulative = finite(cumulative + v * (v - input.observedDewPointC[i]));
      return cumulative;
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDryBulbC: [20, 21, 22],
  observedDewPointC: [10, 11, 12],
  callerResetDayFlags: [0, 1, 0],
  callerOpeningNesterovIndex: 100,
} satisfies Input;
export const exampleOutput = {
  nesterovDailyIndex: [300, 210, 430],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/fire-risk-index-nesterov",
  title: "Nesterov Fire Risk Index Calculator",
  description:
    "Route actual daily Nesterov T(T−Td) history with independently caller established rainfall-reset flags and opening index; no default reset rainfall or fire-response guidance. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "nesterovDailyIndex",
      label: "Nesterov daily index",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDryBulbC: value.observedDryBulbC as readonly number[],
      observedDewPointC: value.observedDewPointC as readonly number[],
      callerResetDayFlags: value.callerResetDayFlags as readonly number[],
      callerOpeningNesterovIndex: value.callerOpeningNesterovIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
