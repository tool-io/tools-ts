import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly feederUsableVolumeLiters: number;
  readonly reserveVolumeLiters: number;
  readonly dailyWithdrawalsLiters: readonly number[];
}>;
export type Output = Readonly<{ readonly firstReserveCrossingDay: number }>;
const inputFields = [
  {
    id: "feederUsableVolumeLiters",
    label: "Feeder usable volume liters",
    kind: "number",
  },
  { id: "reserveVolumeLiters", label: "Reserve volume liters", kind: "number" },
  {
    id: "dailyWithdrawalsLiters",
    label: "Daily withdrawals liters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.feederUsableVolumeLiters, "feederUsableVolumeLiters");
  nonnegative(input.reserveVolumeLiters, "reserveVolumeLiters");
  input.dailyWithdrawalsLiters.forEach((v) =>
    nonnegative(v, "dailyWithdrawalsLiters"),
  );
  if (
    input.reserveVolumeLiters >= input.feederUsableVolumeLiters ||
    !input.dailyWithdrawalsLiters.length
  )
    simpleError(
      "reserveVolumeLiters",
      "Reserve below initial usable volume and nonempty forecast required.",
    );
  let volume = input.feederUsableVolumeLiters;
  for (let i = 0; i < input.dailyWithdrawalsLiters.length; i++) {
    const q = input.dailyWithdrawalsLiters[i];
    if (q > 0 && volume - q <= input.reserveVolumeLiters)
      return {
        firstReserveCrossingDay: i + (volume - input.reserveVolumeLiters) / q,
      };
    volume -= q;
  }
  return simpleError(
    "dailyWithdrawalsLiters",
    "Reserve not crossed within forecast; refill timing is right-censored.",
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  feederUsableVolumeLiters: 2,
  reserveVolumeLiters: 0.5,
  dailyWithdrawalsLiters: [0.5, 0.5, 1],
} satisfies Input;
export const exampleOutput = { firstReserveCrossingDay: 2.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/feeder-jar-refill-frequency",
  title: "Feeder Jar Refill Frequency",
  description:
    "Locate the first forecast feeder reserve crossing with piecewise-constant daily withdrawal; this is not a fixed refill schedule or feeding recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstReserveCrossingDay",
      label: "First reserve crossing day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      feederUsableVolumeLiters: value.feederUsableVolumeLiters as number,
      reserveVolumeLiters: value.reserveVolumeLiters as number,
      dailyWithdrawalsLiters: value.dailyWithdrawalsLiters as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
