import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, rad } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedSunMoonElongationDegrees: number;
}>;
export type Output = Readonly<{
  readonly distantSunLunarIlluminationPercent: number;
}>;
const inputFields = [
  {
    id: "observedSunMoonElongationDegrees",
    label: "Observed sun moon elongation degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.observedSunMoonElongationDegrees < 0 ||
    input.observedSunMoonElongationDegrees > 180
  )
    simpleError("elongation", "Geometric 0..180°.");
  return {
    distantSunLunarIlluminationPercent:
      50 * (1 - Math.cos(rad(input.observedSunMoonElongationDegrees))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSunMoonElongationDegrees: 90,
} satisfies Input;
export const exampleOutput = {
  distantSunLunarIlluminationPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/lunar-phase-illumination-percent",
  title: "Lunar Phase Illumination Percent",
  description:
    "Distant-Sun spherical lunar illumination proxy from unoriented 0..180 elongation; phase age/waxing direction not determined. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "distantSunLunarIlluminationPercent",
      label: "Distant sun lunar illumination percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSunMoonElongationDegrees:
        value.observedSunMoonElongationDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
