import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualDirectPathMeters: number;
  readonly actualReflectedPathMeters: number;
  readonly actualFrequencyHz: number;
  readonly actualMediumSoundSpeed: number;
  readonly callerIndependentRealReflectionCoefficient: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualDirectPathMeters",
    label: "Actual direct path meters",
    kind: "number",
  },
  {
    id: "actualReflectedPathMeters",
    label: "Actual reflected path meters",
    kind: "number",
  },
  { id: "actualFrequencyHz", label: "Actual frequency hz", kind: "number" },
  {
    id: "actualMediumSoundSpeed",
    label: "Actual medium sound speed",
    kind: "number",
  },
  {
    id: "callerIndependentRealReflectionCoefficient",
    label: "Caller independent real reflection coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualDirectPathMeters, "direct");
  positive(input.actualReflectedPathMeters, "reflected");
  positive(input.actualMediumSoundSpeed, "c");
  nonnegative(input.actualFrequencyHz, "f");
  if (Math.abs(input.callerIndependentRealReflectionCoefficient) > 1)
    simpleError("reflection", "Passive realcoefficient|R|≤1.");
  const q =
      (input.callerIndependentRealReflectionCoefficient *
        input.actualDirectPathMeters) /
      input.actualReflectedPathMeters,
    phase =
      (2 *
        Math.PI *
        input.actualFrequencyHz *
        (input.actualReflectedPathMeters - input.actualDirectPathMeters)) /
      input.actualMediumSoundSpeed,
    a = Math.sqrt(Math.max(0, 1 + q * q + 2 * q * Math.cos(phase)));
  if (a === 0)
    simpleError(
      "cancellation",
      "Exactzeroamplitudehas−infinitedB,nofinite substitute.",
    );
  return {
    relativePressureAmplitude: a,
    signedRelativeLevelDb: 20 * Math.log10(a),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualDirectPathMeters: 1,
    actualReflectedPathMeters: 1,
    actualFrequencyHz: 1,
    actualMediumSoundSpeed: 1,
    callerIndependentRealReflectionCoefficient: 1,
  },
  output: {
    result: {
      relativePressureAmplitude: 2,
      signedRelativeLevelDb: 6.020599913279624,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/ground-reflection-two-ray",
  title: "Ground Reflection Two Ray Calculator",
  description:
    "Restrictedcoherenttwo-rayrealreflection sphericalspreadingpathinterference,not fullfrequencydependentcomplexgroundimpedance/nearfield. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          relativePressureAmplitude: { type: "number" },
          signedRelativeLevelDb: { type: "number" },
        },
        required: ["relativePressureAmplitude", "signedRelativeLevelDb"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
