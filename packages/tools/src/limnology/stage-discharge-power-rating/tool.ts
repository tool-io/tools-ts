import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly stagesM: readonly number[];
  readonly zeroFlowStageM: number;
  readonly calibratedCoefficient: number;
  readonly ratingExponent: number;
}>;
export type Output = Readonly<{
  readonly predictedDischargesM3PerSecond: readonly number[];
  readonly atOrBelowControlFlags: readonly number[];
}>;
const inputFields = [
  { id: "stagesM", label: "Stages m", kind: "numberList" },
  { id: "zeroFlowStageM", label: "Zero flow stage m", kind: "number" },
  {
    id: "calibratedCoefficient",
    label: "Calibrated coefficient",
    kind: "number",
  },
  { id: "ratingExponent", label: "Rating exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.ratingExponent, "ratingExponent");
  nonnegative(input.calibratedCoefficient, "calibratedCoefficient");
  if (!input.stagesM.length)
    simpleError("stagesM", "Nonempty stage queries required.");
  return {
    predictedDischargesM3PerSecond: input.stagesM.map(
      (h) =>
        input.calibratedCoefficient *
        Math.max(0, h - input.zeroFlowStageM) ** input.ratingExponent,
    ),
    atOrBelowControlFlags: input.stagesM.map((h) =>
      h <= input.zeroFlowStageM ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stagesM: [0, 1, 3],
  zeroFlowStageM: 1,
  calibratedCoefficient: 2,
  ratingExponent: 2,
} satisfies Input;
export const exampleOutput = {
  predictedDischargesM3PerSecond: [0, 0, 8],
  atOrBelowControlFlags: [1, 1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/stage-discharge-power-rating",
  title: "Stage Discharge Power Rating",
  description:
    "Evaluate a caller stage/discharge power rating with zero-flow control stage; stages at/below control are modeled dry, while backwater, hysteresis and calibration range remain external.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedDischargesM3PerSecond",
      label: "Predicted discharges m3 per second",
      kind: "numberList",
    },
    {
      id: "atOrBelowControlFlags",
      label: "At or below control flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      stagesM: value.stagesM as readonly number[],
      zeroFlowStageM: value.zeroFlowStageM as number,
      calibratedCoefficient: value.calibratedCoefficient as number,
      ratingExponent: value.ratingExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
