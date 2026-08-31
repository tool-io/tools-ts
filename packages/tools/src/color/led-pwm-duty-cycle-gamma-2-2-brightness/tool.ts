import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly perceivedBrightnessFractions: readonly number[];
  readonly pwmResolutionBits: number;
}>;
export type Output = Readonly<{
  readonly gamma22DutyFractions: readonly number[];
  readonly roundedPwmCodes: readonly number[];
}>;
const inputFields = [
  {
    id: "perceivedBrightnessFractions",
    label: "Perceived brightness fractions",
    kind: "numberList",
  },
  { id: "pwmResolutionBits", label: "Pwm resolution bits", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.pwmResolutionBits, "bits", 1, 16);
  input.perceivedBrightnessFractions.forEach((v) => fraction(v, "brightness"));
  const duty = input.perceivedBrightnessFractions.map((v) => v ** 2.2),
    max = 2 ** input.pwmResolutionBits - 1;
  return {
    gamma22DutyFractions: duty,
    roundedPwmCodes: duty.map((v) => Math.round(v * max)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  perceivedBrightnessFractions: [0, 0.5, 1],
  pwmResolutionBits: 8,
} satisfies Input;
export const exampleOutput = {
  gamma22DutyFractions: [0, 0.217637640824031, 1],
  roundedPwmCodes: [0, 55, 255],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/led-pwm-duty-cycle-gamma-2-2-brightness",
  title: "LED PWM Duty Cycle Gamma 2.2 Brightness",
  description:
    "Map caller target perceptual-brightness fractions through explicit gamma-2.2 power heuristic to duty and bounded PWM codes; uncalibrated, no LED electrical current, thermal safety or exact visual response guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "gamma22DutyFractions",
      label: "Gamma22 duty fractions",
      kind: "numberList",
    },
    { id: "roundedPwmCodes", label: "Rounded pwm codes", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      perceivedBrightnessFractions:
        value.perceivedBrightnessFractions as readonly number[],
      pwmResolutionBits: value.pwmResolutionBits as number,
    }),
});
export const run = tool.execute;
export default tool;
