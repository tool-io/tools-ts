import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly referenceIncidentAngleDegrees: number;
  readonly referencePhaseSpeedMPerSecond: number;
  readonly localPhaseSpeedMPerSecond: number;
}>;
export type Output = Readonly<{
  readonly localRefractionAngleDegrees: number;
  readonly refractionHeightCoefficient: number;
}>;
const inputFields = [
  {
    id: "referenceIncidentAngleDegrees",
    label: "Reference incident angle degrees",
    kind: "number",
  },
  {
    id: "referencePhaseSpeedMPerSecond",
    label: "Reference phase speed m per second",
    kind: "number",
  },
  {
    id: "localPhaseSpeedMPerSecond",
    label: "Local phase speed m per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.referencePhaseSpeedMPerSecond,
    "referencePhaseSpeedMPerSecond",
  );
  positive(input.localPhaseSpeedMPerSecond, "localPhaseSpeedMPerSecond");
  if (Math.abs(input.referenceIncidentAngleDegrees) >= 90)
    simpleError(
      "referenceIncidentAngleDegrees",
      "Incident angle within (-90,90) required.",
    );
  const a = (input.referenceIncidentAngleDegrees * Math.PI) / 180,
    s =
      (Math.sin(a) * input.localPhaseSpeedMPerSecond) /
      input.referencePhaseSpeedMPerSecond;
  if (Math.abs(s) >= 1)
    simpleError(
      "localPhaseSpeedMPerSecond",
      "No finite shoreward refracted ray at critical/evanescent conditions.",
    );
  const b = Math.asin(s);
  return {
    localRefractionAngleDegrees: (b * 180) / Math.PI,
    refractionHeightCoefficient: Math.sqrt(Math.cos(a) / Math.cos(b)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceIncidentAngleDegrees: 30,
  referencePhaseSpeedMPerSecond: 10,
  localPhaseSpeedMPerSecond: 5,
} satisfies Input;
export const exampleOutput = {
  localRefractionAngleDegrees: 14.477512185929923,
  refractionHeightCoefficient: 0.9457416090031758,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/wave-refraction-snells-coefficient",
  title: "Wave Refraction Snells Coefficient",
  description:
    "Apply Snell refraction on parallel depth contours and conservation of ray width, retaining signed angle; critical/nonpropagating rays error rather than clamp.",
  inputs: inputFields,
  outputs: [
    {
      id: "localRefractionAngleDegrees",
      label: "Local refraction angle degrees",
      kind: "number",
    },
    {
      id: "refractionHeightCoefficient",
      label: "Refraction height coefficient",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceIncidentAngleDegrees:
        value.referenceIncidentAngleDegrees as number,
      referencePhaseSpeedMPerSecond:
        value.referencePhaseSpeedMPerSecond as number,
      localPhaseSpeedMPerSecond: value.localPhaseSpeedMPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
