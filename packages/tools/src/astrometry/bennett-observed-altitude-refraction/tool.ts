import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, rad } from "../shared.js";

export type Input = Readonly<{
  readonly observedAltitudeDegrees: number;
  readonly pressureHpa: number;
  readonly temperatureC: number;
}>;
export type Output = Readonly<{
  readonly refractionArcminutes: number;
  readonly trueAltitudeDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.observedAltitudeDegrees < 0 ||
    input.observedAltitudeDegrees > 90 ||
    input.temperatureC <= -273
  )
    simpleError(
      "observedAltitudeDegrees",
      "Observed altitude in [0,90] degrees and temperature above -273°C required.",
    );
  nonnegative(input.pressureHpa, "pressureHpa");
  const refractionArcminutes =
    input.observedAltitudeDegrees === 90
      ? 0
      : (((Math.max(
          0,
          1 /
            Math.tan(
              rad(
                input.observedAltitudeDegrees +
                  7.31 / (input.observedAltitudeDegrees + 4.4),
              ),
            ),
        ) *
          input.pressureHpa) /
          1010) *
          283) /
        (273 + input.temperatureC);
  return {
    refractionArcminutes,
    trueAltitudeDegrees:
      input.observedAltitudeDegrees - refractionArcminutes / 60,
  };
};
export const exampleInput = {
  observedAltitudeDegrees: 45,
  pressureHpa: 1010,
  temperatureC: 10,
} satisfies Input;
export const exampleOutput = {
  refractionArcminutes: 0.9948479678568615,
  trueAltitudeDegrees: 44.98341920053572,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/bennett-observed-altitude-refraction",
  title: "Bennett Observed Altitude Refraction",
  description:
    "Apply Bennett refraction to observed altitude, with caller pressure and temperature; anomalous atmospheric structure is not modeled.",
  inputs: [
    {
      id: "observedAltitudeDegrees",
      label: "Observed altitude degrees",
      kind: "number",
    },
    { id: "pressureHpa", label: "Pressure hpa", kind: "number" },
    { id: "temperatureC", label: "Temperature c", kind: "number" },
  ],
  outputs: [
    {
      id: "refractionArcminutes",
      label: "Refraction arcminutes",
      kind: "number",
    },
    {
      id: "trueAltitudeDegrees",
      label: "True altitude degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAltitudeDegrees: value.observedAltitudeDegrees as number,
      pressureHpa: value.pressureHpa as number,
      temperatureC: value.temperatureC as number,
    }),
});
export const run = tool.execute;
export default tool;
