import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredMcaVelocitiesCmPerSecond: readonly number[];
  readonly callerVerifiedAngleCorrectionFactor: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyMeasuredMcaVelocitiesCmPerSecond",
    label: "Independently measured mca velocities cm per second",
    kind: "numberList",
  },
  {
    id: "callerVerifiedAngleCorrectionFactor",
    label: "Caller verified angle correction factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (!input.independentlyMeasuredMcaVelocitiesCmPerSecond.length)
    simpleError("samples", "Actual nonempty qualifying waveform samples.");
  input.independentlyMeasuredMcaVelocitiesCmPerSecond.forEach((v) =>
    nonnegative(v, "velocity"),
  );
  positive(input.callerVerifiedAngleCorrectionFactor, "correction");
  return {
    observedAngleCorrectedSampledMcaPeakCmPerSecond:
      Math.max(...input.independentlyMeasuredMcaVelocitiesCmPerSecond) *
      input.callerVerifiedAngleCorrectionFactor,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredMcaVelocitiesCmPerSecond: [20, 50, 40],
    callerVerifiedAngleCorrectionFactor: 1,
  },
  output: { result: { observedAngleCorrectedSampledMcaPeakCmPerSecond: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/middle-cerebral-artery-peak-systolic",
  title: "MCA Peak Systolic Velocity Calculator",
  description:
    "Actual already clinically qualified MCAvelocity samples with independently established angle correction, not a recovered continuous systolic peak, anemia determination or threshold/MoM.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedAngleCorrectedSampledMcaPeakCmPerSecond: { type: "number" },
        },
        required: ["observedAngleCorrectedSampledMcaPeakCmPerSecond"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
