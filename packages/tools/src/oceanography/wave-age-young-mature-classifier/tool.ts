import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly wavePhaseSpeedMPerSecond: number;
  readonly windSpeedMPerSecond: number;
  readonly airSideDragCoefficient: number;
  readonly callerWaveAgeBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly frictionVelocityMPerSecond: number;
  readonly waveAge: number;
  readonly callerAgeClassCode: number;
}>;
const inputFields = [
  {
    id: "wavePhaseSpeedMPerSecond",
    label: "Wave phase speed m per second",
    kind: "number",
  },
  {
    id: "windSpeedMPerSecond",
    label: "Wind speed m per second",
    kind: "number",
  },
  {
    id: "airSideDragCoefficient",
    label: "Air side drag coefficient",
    kind: "number",
  },
  {
    id: "callerWaveAgeBounds",
    label: "Caller wave age bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.wavePhaseSpeedMPerSecond, "wavePhaseSpeedMPerSecond");
  positive(input.windSpeedMPerSecond, "windSpeedMPerSecond");
  positive(input.airSideDragCoefficient, "airSideDragCoefficient");
  input.callerWaveAgeBounds.forEach((v) => positive(v, "callerWaveAgeBounds"));
  if (
    input.callerWaveAgeBounds.length !== 2 ||
    input.callerWaveAgeBounds[0] >= input.callerWaveAgeBounds[1]
  )
    simpleError("bounds", "Ordered two-value caller wave-age bands required.");
  const frictionVelocityMPerSecond =
      input.windSpeedMPerSecond * Math.sqrt(input.airSideDragCoefficient),
    waveAge = input.wavePhaseSpeedMPerSecond / frictionVelocityMPerSecond;
  return {
    frictionVelocityMPerSecond,
    waveAge,
    callerAgeClassCode:
      waveAge < input.callerWaveAgeBounds[0]
        ? 0
        : waveAge < input.callerWaveAgeBounds[1]
          ? 1
          : 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wavePhaseSpeedMPerSecond: 2,
  windSpeedMPerSecond: 10,
  airSideDragCoefficient: 0.01,
  callerWaveAgeBounds: [1, 3],
} satisfies Input;
export const exampleOutput = {
  frictionVelocityMPerSecond: 1,
  waveAge: 2,
  callerAgeClassCode: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/wave-age-young-mature-classifier",
  title: "Wave Age Young Mature Classifier",
  description:
    "Screen c_phase/u_star wave age using supplied wind and air-side drag, with caller phase classes; this convention is not c/U10 and does not identify fetch-limited growth by itself.",
  inputs: inputFields,
  outputs: [
    {
      id: "frictionVelocityMPerSecond",
      label: "Friction velocity m per second",
      kind: "number",
    },
    { id: "waveAge", label: "Wave age", kind: "number" },
    {
      id: "callerAgeClassCode",
      label: "Caller age class code",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      wavePhaseSpeedMPerSecond: value.wavePhaseSpeedMPerSecond as number,
      windSpeedMPerSecond: value.windSpeedMPerSecond as number,
      airSideDragCoefficient: value.airSideDragCoefficient as number,
      callerWaveAgeBounds: value.callerWaveAgeBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
