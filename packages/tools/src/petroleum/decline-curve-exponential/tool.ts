import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerInitialRateM3Day: number;
  readonly callerInitialNominalDeclinePerDay: number;
  readonly elapsedDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly arpsModeledRatesM3Day: readonly number[];
  readonly arpsIntegratedProductionM3: readonly number[];
}>;
const inputFields = [
  {
    id: "callerInitialRateM3Day",
    label: "Caller initial rate m3 day",
    kind: "number",
  },
  {
    id: "callerInitialNominalDeclinePerDay",
    label: "Caller initial nominal decline per day",
    kind: "number",
  },
  { id: "elapsedDays", label: "Elapsed days", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerInitialRateM3Day, "callerInitialRateM3Day");
  nonnegative(
    input.callerInitialNominalDeclinePerDay,
    "callerInitialNominalDeclinePerDay",
  );
  input.elapsedDays.forEach((v) => nonnegative(v, "elapsedDays"));
  const D = input.callerInitialNominalDeclinePerDay;
  return {
    arpsModeledRatesM3Day: input.elapsedDays.map((t) =>
      D === 0
        ? input.callerInitialRateM3Day
        : input.callerInitialRateM3Day * Math.exp(-D * t),
    ),
    arpsIntegratedProductionM3: input.elapsedDays.map((t) =>
      D === 0
        ? input.callerInitialRateM3Day * t
        : (input.callerInitialRateM3Day * -Math.expm1(-D * t)) / D,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerInitialRateM3Day: 100,
  callerInitialNominalDeclinePerDay: 0.1,
  elapsedDays: [0, 1, 2],
} satisfies Input;
export const exampleOutput = {
  arpsModeledRatesM3Day: [100.0, 90.48374180359595, 81.87307530779819],
  arpsIntegratedProductionM3: [0.0, 95.16258196404041, 181.26924692201814],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/decline-curve-exponential",
  title: "Petroleum Decline Curve Exponential Calculator",
  description:
    "Named Arps exponential rate AND exact integrated finite-horizon production, explicit nominal decline/day, zero-decline limit, not fitted parameters, economic reserve or infinite-tail recoverable volume. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "arpsModeledRatesM3Day",
      label: "Arps modeled rates m3 day",
      kind: "numberList",
    },
    {
      id: "arpsIntegratedProductionM3",
      label: "Arps integrated production m3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerInitialRateM3Day: value.callerInitialRateM3Day as number,
      callerInitialNominalDeclinePerDay:
        value.callerInitialNominalDeclinePerDay as number,
      elapsedDays: value.elapsedDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
