import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerFrictionStrengthPa: number;
  readonly callerHallPetchPaSqrtM: number;
  readonly grainDiameterM: number;
}>;
export type Output = Readonly<{ readonly hallPetchModeledYieldPa: number }>;
const inputFields = [
  {
    id: "callerFrictionStrengthPa",
    label: "Caller friction strength pa",
    kind: "number",
  },
  {
    id: "callerHallPetchPaSqrtM",
    label: "Caller hall petch pa sqrt m",
    kind: "number",
  },
  { id: "grainDiameterM", label: "Grain diameter m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.grainDiameterM, "grainDiameterM");
  nonnegative(input.callerFrictionStrengthPa, "callerFrictionStrengthPa");
  nonnegative(input.callerHallPetchPaSqrtM, "callerHallPetchPaSqrtM");
  return {
    hallPetchModeledYieldPa:
      input.callerFrictionStrengthPa +
      input.callerHallPetchPaSqrtM / Math.sqrt(input.grainDiameterM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFrictionStrengthPa: 10,
  callerHallPetchPaSqrtM: 2,
  grainDiameterM: 0.25,
} satisfies Input;
export const exampleOutput = { hallPetchModeledYieldPa: 14 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/hall-petch-strength",
  title: "Hall-Petch Strength Calculator",
  description:
    "Hall–Petch σ0+k/√d with independently matched grain-size regime, no extrapolation to inverse Hall–Petch nanograins. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "hallPetchModeledYieldPa",
      label: "Hall petch modeled yield pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFrictionStrengthPa: value.callerFrictionStrengthPa as number,
      callerHallPetchPaSqrtM: value.callerHallPetchPaSqrtM as number,
      grainDiameterM: value.grainDiameterM as number,
    }),
});
export const run = tool.execute;
export default tool;
