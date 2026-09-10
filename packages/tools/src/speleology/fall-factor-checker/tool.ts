import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualFallDistanceMeters: number;
  readonly actualActiveEnergyAbsorbingRopeLengthMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFallDistanceMeters",
    label: "Actual fall distance meters",
    kind: "number",
  },
  {
    id: "actualActiveEnergyAbsorbingRopeLengthMeters",
    label: "Actual active energy absorbing rope length meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualFallDistanceMeters, "fall");
  positive(input.actualActiveEnergyAbsorbingRopeLengthMeters, "activerope");
  const r =
    input.actualFallDistanceMeters /
    input.actualActiveEnergyAbsorbingRopeLengthMeters;
  return {
    observedGeometricFallFactor: r,
    atOrAboveNominalFactorOne: r >= 1,
    atOrAboveNominalFactorTwo: r >= 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFallDistanceMeters: 1,
    actualActiveEnergyAbsorbingRopeLengthMeters: 2,
  },
  output: {
    result: {
      observedGeometricFallFactor: 0.5,
      atOrAboveNominalFactorOne: false,
      atOrAboveNominalFactorTwo: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/fall-factor-checker",
  title: "Fall Factor 1-2 Checker for Rigging",
  description:
    "Geometric actual fall distance/active rope length only.1 and 2flags are not rigging grades, impact force, equipment survival or safe fall authorization.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
