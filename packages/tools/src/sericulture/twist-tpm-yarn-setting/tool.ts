import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly targetTwistTurnsPerMeter: number;
  readonly deliverySpeedMPerMinute: number;
  readonly insertedTurnsPerSpindleRevolution: number;
  readonly twistTransferFraction: number;
  readonly callerMaximumSpindleRpm: number;
}>;
export type Output = Readonly<{
  readonly requiredSpindleRpm: number;
  readonly rpmMargin: number;
}>;
const inputFields = [
  {
    id: "targetTwistTurnsPerMeter",
    label: "Target twist turns per meter",
    kind: "number",
  },
  {
    id: "deliverySpeedMPerMinute",
    label: "Delivery speed m per minute",
    kind: "number",
  },
  {
    id: "insertedTurnsPerSpindleRevolution",
    label: "Inserted turns per spindle revolution",
    kind: "number",
  },
  {
    id: "twistTransferFraction",
    label: "Twist transfer fraction",
    kind: "number",
  },
  {
    id: "callerMaximumSpindleRpm",
    label: "Caller maximum spindle rpm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.insertedTurnsPerSpindleRevolution,
    "insertedTurnsPerSpindleRevolution",
  );
  positive(input.twistTransferFraction, "twistTransferFraction");
  nonnegative(input.targetTwistTurnsPerMeter, "targetTwistTurnsPerMeter");
  nonnegative(input.deliverySpeedMPerMinute, "deliverySpeedMPerMinute");
  nonnegative(input.callerMaximumSpindleRpm, "callerMaximumSpindleRpm");
  fraction(input.twistTransferFraction, "twistTransferFraction");
  const requiredSpindleRpm =
    (input.targetTwistTurnsPerMeter * input.deliverySpeedMPerMinute) /
    (input.insertedTurnsPerSpindleRevolution * input.twistTransferFraction);
  return {
    requiredSpindleRpm,
    rpmMargin: input.callerMaximumSpindleRpm - requiredSpindleRpm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetTwistTurnsPerMeter: 200,
  deliverySpeedMPerMinute: 10,
  insertedTurnsPerSpindleRevolution: 2,
  twistTransferFraction: 0.8,
  callerMaximumSpindleRpm: 1000,
} satisfies Input;
export const exampleOutput = {
  requiredSpindleRpm: 1250,
  rpmMargin: -250,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/twist-tpm-yarn-setting",
  title: "Twist TPM Yarn Setting",
  description:
    "Invert desired yarn twist/delivery to spindle RPM using caller turns per revolution and transfer calibration; mechanical suitability and speed safety remain external.",
  inputs: inputFields,
  outputs: [
    { id: "requiredSpindleRpm", label: "Required spindle rpm", kind: "number" },
    { id: "rpmMargin", label: "Rpm margin", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      targetTwistTurnsPerMeter: value.targetTwistTurnsPerMeter as number,
      deliverySpeedMPerMinute: value.deliverySpeedMPerMinute as number,
      insertedTurnsPerSpindleRevolution:
        value.insertedTurnsPerSpindleRevolution as number,
      twistTransferFraction: value.twistTransferFraction as number,
      callerMaximumSpindleRpm: value.callerMaximumSpindleRpm as number,
    }),
});
export const run = tool.execute;
export default tool;
