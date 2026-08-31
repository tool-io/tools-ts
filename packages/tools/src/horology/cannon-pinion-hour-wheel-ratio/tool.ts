import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly cannonPinionTeeth: number;
  readonly intermediateMinuteWheelTeeth: number;
  readonly minutePinionTeeth: number;
  readonly hourWheelTeeth: number;
  readonly observedMinuteHandTurns: number;
}>;
export type Output = Readonly<{
  readonly compoundMinuteToHourReductionRatio: number;
  readonly modeledHourHandTurns: number;
}>;
const inputFields = [
  { id: "cannonPinionTeeth", label: "Cannon pinion teeth", kind: "number" },
  {
    id: "intermediateMinuteWheelTeeth",
    label: "Intermediate minute wheel teeth",
    kind: "number",
  },
  { id: "minutePinionTeeth", label: "Minute pinion teeth", kind: "number" },
  { id: "hourWheelTeeth", label: "Hour wheel teeth", kind: "number" },
  {
    id: "observedMinuteHandTurns",
    label: "Observed minute hand turns",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.cannonPinionTeeth,
    input.intermediateMinuteWheelTeeth,
    input.minutePinionTeeth,
    input.hourWheelTeeth,
  ].forEach((v) => bounded(v, "teeth", 1, 10000));
  const ratio =
    (input.intermediateMinuteWheelTeeth / input.cannonPinionTeeth) *
    (input.hourWheelTeeth / input.minutePinionTeeth);
  return {
    compoundMinuteToHourReductionRatio: ratio,
    modeledHourHandTurns: input.observedMinuteHandTurns / ratio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cannonPinionTeeth: 10,
  intermediateMinuteWheelTeeth: 30,
  minutePinionTeeth: 8,
  hourWheelTeeth: 32,
  observedMinuteHandTurns: 12,
} satisfies Input;
export const exampleOutput = {
  compoundMinuteToHourReductionRatio: 12,
  modeledHourHandTurns: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/cannon-pinion-hour-wheel-ratio",
  title: "Cannon Pinion to Hour Wheel Ratio Calculator",
  description:
    "Evaluate actual two-mesh motion-work reduction and signed minute-to-hour hand displacement; two external meshes preserve rotation direction, no universal 12:1 assumption or unknown intermediate gearing.",
  inputs: inputFields,
  outputs: [
    {
      id: "compoundMinuteToHourReductionRatio",
      label: "Compound minute to hour reduction ratio",
      kind: "number",
    },
    {
      id: "modeledHourHandTurns",
      label: "Modeled hour hand turns",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cannonPinionTeeth: value.cannonPinionTeeth as number,
      intermediateMinuteWheelTeeth:
        value.intermediateMinuteWheelTeeth as number,
      minutePinionTeeth: value.minutePinionTeeth as number,
      hourWheelTeeth: value.hourWheelTeeth as number,
      observedMinuteHandTurns: value.observedMinuteHandTurns as number,
    }),
});
export const run = tool.execute;
export default tool;
