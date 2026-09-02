import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, skyIntegral } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly redshift: number;
  readonly hubbleKmPerSecondPerMpc: number;
  readonly matterDensityFraction: number;
}>;
export type Output = Readonly<{ readonly flatModelComovingMpc: number }>;
const inputFields = [
  { id: "redshift", label: "Redshift", kind: "number" },
  {
    id: "hubbleKmPerSecondPerMpc",
    label: "Hubble km per second per mpc",
    kind: "number",
  },
  {
    id: "matterDensityFraction",
    label: "Matter density fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const integralValue = skyIntegral(
    input.redshift,
    input.hubbleKmPerSecondPerMpc,
    input.matterDensityFraction,
    "distance",
  );
  return {
    flatModelComovingMpc:
      (integralValue * 299792.458) / input.hubbleKmPerSecondPerMpc,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  redshift: 1,
  hubbleKmPerSecondPerMpc: 70,
  matterDensityFraction: 0,
} satisfies Input;
export const exampleOutput = {
  flatModelComovingMpc: 4282.7494,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/comoving-distance-approx-z",
  title: "Approximate Comoving Distance From z",
  description:
    "Bounded 2048-panel Simpson quadrature in flat matter+Lambda Fried mann model, radiation/curvature omitted; angular-distance and lookback integrals are not interchangeable. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "flatModelComovingMpc",
      label: "Flat model comoving mpc",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      redshift: value.redshift as number,
      hubbleKmPerSecondPerMpc: value.hubbleKmPerSecondPerMpc as number,
      matterDensityFraction: value.matterDensityFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
