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
  bounded,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly barrelWheelTeeth: number;
  readonly drivenCenterPinionTeeth: number;
  readonly observedCenterWheelRevolutions: number;
  readonly independentlyMeasuredUnusableSpringTurns: number;
}>;
export type Output = Readonly<{
  readonly observedBarrelRotations: number;
  readonly usableMainspringUnwindTurns: number;
}>;
const inputFields = [
  { id: "barrelWheelTeeth", label: "Barrel wheel teeth", kind: "number" },
  {
    id: "drivenCenterPinionTeeth",
    label: "Driven center pinion teeth",
    kind: "number",
  },
  {
    id: "observedCenterWheelRevolutions",
    label: "Observed center wheel revolutions",
    kind: "number",
  },
  {
    id: "independentlyMeasuredUnusableSpringTurns",
    label: "Independently measured unusable spring turns",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.barrelWheelTeeth, "barrelTeeth", 1, 10000);
  bounded(input.drivenCenterPinionTeeth, "pinionTeeth", 1, 10000);
  nonnegative(input.observedCenterWheelRevolutions, "turns");
  nonnegative(input.independentlyMeasuredUnusableSpringTurns, "unusable");
  const barrel =
    input.observedCenterWheelRevolutions *
    (input.drivenCenterPinionTeeth / input.barrelWheelTeeth);
  if (input.independentlyMeasuredUnusableSpringTurns > barrel)
    simpleError(
      "spring",
      "Excluded unusable turns exceed observed barrel rotation.",
    );
  return {
    observedBarrelRotations: barrel,
    usableMainspringUnwindTurns:
      barrel - input.independentlyMeasuredUnusableSpringTurns,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  barrelWheelTeeth: 80,
  drivenCenterPinionTeeth: 10,
  observedCenterWheelRevolutions: 40,
  independentlyMeasuredUnusableSpringTurns: 1,
} satisfies Input;
export const exampleOutput = {
  observedBarrelRotations: 5,
  usableMainspringUnwindTurns: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/barrel-teeth-mainspring-turns",
  title: "Barrel Teeth to Mainspring Turns Calculator",
  description:
    "Infer actual barrel unwind turns from observed driven-wheel rotations and measured tooth ratio, separately excluding caller unusable turns; no tooth-count-alone spring capacity or reserve forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBarrelRotations",
      label: "Observed barrel rotations",
      kind: "number",
    },
    {
      id: "usableMainspringUnwindTurns",
      label: "Usable mainspring unwind turns",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      barrelWheelTeeth: value.barrelWheelTeeth as number,
      drivenCenterPinionTeeth: value.drivenCenterPinionTeeth as number,
      observedCenterWheelRevolutions:
        value.observedCenterWheelRevolutions as number,
      independentlyMeasuredUnusableSpringTurns:
        value.independentlyMeasuredUnusableSpringTurns as number,
    }),
});
export const run = tool.execute;
export default tool;
