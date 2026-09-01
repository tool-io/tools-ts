import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRowingWatts: readonly number[];
  readonly callerErgometerPowerConstant: number;
}>;
export type Output = Readonly<{
  readonly callerErgometer500mSplitSeconds: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRowingWatts",
    label: "Observed rowing watts",
    kind: "numberList",
  },
  {
    id: "callerErgometerPowerConstant",
    label: "Caller ergometer power constant",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRowingWatts.forEach((v) => positive(v, "observedRowingWatts"));
  positive(input.callerErgometerPowerConstant, "callerErgometerPowerConstant");
  return {
    callerErgometer500mSplitSeconds: input.observedRowingWatts.map(
      (v) => 500 * Math.cbrt(input.callerErgometerPowerConstant / v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRowingWatts: [100, 200],
  callerErgometerPowerConstant: 2.8,
} satisfies Input;
export const exampleOutput = {
  callerErgometer500mSplitSeconds: [151.82944859378313, 120.50711320876151],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/rower-split-500m-from-watts",
  title: "Rowing 500m Split From Watts",
  description:
    "Invert caller ergometer calibrated cubic power/speed convention to 500m split; no boat hydrodynamic universal, medical exercise recommendation or generic speed alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerErgometer500mSplitSeconds",
      label: "Caller ergometer500m split seconds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRowingWatts: value.observedRowingWatts as readonly number[],
      callerErgometerPowerConstant:
        value.callerErgometerPowerConstant as number,
    }),
});
export const run = tool.execute;
export default tool;
