import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly stressTensorPa: readonly (readonly number[])[];
  readonly strainRateTensorPerYear: readonly (readonly number[])[];
  readonly secondsPerYear: number;
}>;
export type Output = Readonly<{
  readonly signedVolumetricStrainPowerWattsPerM3: number;
  readonly nonnegativeDissipationScreen: boolean;
}>;
const inputFields = [
  { id: "stressTensorPa", label: "Stress tensor pa", kind: "matrix" },
  {
    id: "strainRateTensorPerYear",
    label: "Strain rate tensor per year",
    kind: "matrix",
  },
  { id: "secondsPerYear", label: "Seconds per year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.secondsPerYear, "secondsPerYear");
  const a = input.stressTensorPa,
    b = input.strainRateTensorPerYear;
  if (
    a.length !== 3 ||
    b.length !== 3 ||
    a.some((row) => row.length !== 3) ||
    b.some((row) => row.length !== 3)
  )
    simpleError("stressTensorPa", "Two 3×3 symmetric tensors required.");
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (a[i][j] !== a[j][i] || b[i][j] !== b[j][i])
        simpleError(
          "stressTensorPa",
          "Symmetric tensor components required, not engineering shear rates.",
        );
  let power = 0;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) power += a[i][j] * b[i][j];
  const signedVolumetricStrainPowerWattsPerM3 = power / input.secondsPerYear;
  return {
    signedVolumetricStrainPowerWattsPerM3,
    nonnegativeDissipationScreen: signedVolumetricStrainPowerWattsPerM3 >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stressTensorPa: [
    [2, 1, 0],
    [1, 3, 0],
    [0, 0, 4],
  ],
  strainRateTensorPerYear: [
    [1, 2, 0],
    [2, 1, 0],
    [0, 0, -2],
  ],
  secondsPerYear: 10,
} satisfies Input;
export const exampleOutput = {
  signedVolumetricStrainPowerWattsPerM3: 0.1,
  nonnegativeDissipationScreen: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/strain-heating-contribution",
  title: "Strain Heating Contribution",
  description:
    "Contract full symmetric stress and strain-rate tensors, counting off-diagonal shear twice; negative power is preserved and flagged as inconsistent with positive dissipation, not relabeled heating.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedVolumetricStrainPowerWattsPerM3",
      label: "Signed volumetric strain power watts per m3",
      kind: "number",
    },
    {
      id: "nonnegativeDissipationScreen",
      label: "Nonnegative dissipation screen",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      stressTensorPa: value.stressTensorPa as readonly (readonly number[])[],
      strainRateTensorPerYear:
        value.strainRateTensorPerYear as readonly (readonly number[])[],
      secondsPerYear: value.secondsPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
