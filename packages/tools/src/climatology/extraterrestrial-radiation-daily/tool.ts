import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, solar } from "../shared.js";

export type Input = Readonly<{
  readonly latitudeDegrees: number;
  readonly solarDeclinationRadians: number;
  readonly inverseRelativeDistanceSquared: number;
  readonly solarConstantMjPerM2Minute: number;
}>;
export type Output = Readonly<{
  readonly extraterrestrialDailyRadiationMjPerM2: number;
  readonly geometricSunsetHourAngleRadians: number;
}>;
const inputFields = [
  { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
  {
    id: "solarDeclinationRadians",
    label: "Solar declination radians",
    kind: "number",
  },
  {
    id: "inverseRelativeDistanceSquared",
    label: "Inverse relative distance squared",
    kind: "number",
  },
  {
    id: "solarConstantMjPerM2Minute",
    label: "Solar constant mj per m2 minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.inverseRelativeDistanceSquared,
    "inverseRelativeDistanceSquared",
  );
  positive(input.solarConstantMjPerM2Minute, "solarConstantMjPerM2Minute");
  const { omega, phi } = solar(
    input.latitudeDegrees,
    input.solarDeclinationRadians,
  );
  return {
    extraterrestrialDailyRadiationMjPerM2: Math.max(
      0,
      (1440 / Math.PI) *
        input.solarConstantMjPerM2Minute *
        input.inverseRelativeDistanceSquared *
        (omega * Math.sin(phi) * Math.sin(input.solarDeclinationRadians) +
          Math.cos(phi) *
            Math.cos(input.solarDeclinationRadians) *
            Math.sin(omega)),
    ),
    geometricSunsetHourAngleRadians: omega,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  latitudeDegrees: 0,
  solarDeclinationRadians: 0,
  inverseRelativeDistanceSquared: 1,
  solarConstantMjPerM2Minute: 0.082,
} satisfies Input;
export const exampleOutput = {
  extraterrestrialDailyRadiationMjPerM2: 37.586031360582005,
  geometricSunsetHourAngleRadians: 1.5707963267948966,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/extraterrestrial-radiation-daily",
  title: "Extraterrestrial Radiation Daily",
  description:
    "Integrate geometric daily extraterrestrial solar radiation from independently supplied declination/distance correction, handling polar day/night without apparent sunrise/refraction or cloud attenuation.",
  inputs: inputFields,
  outputs: [
    {
      id: "extraterrestrialDailyRadiationMjPerM2",
      label: "Extraterrestrial daily radiation mj per m2",
      kind: "number",
    },
    {
      id: "geometricSunsetHourAngleRadians",
      label: "Geometric sunset hour angle radians",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      latitudeDegrees: value.latitudeDegrees as number,
      solarDeclinationRadians: value.solarDeclinationRadians as number,
      inverseRelativeDistanceSquared:
        value.inverseRelativeDistanceSquared as number,
      solarConstantMjPerM2Minute: value.solarConstantMjPerM2Minute as number,
    }),
});
export const run = tool.execute;
export default tool;
