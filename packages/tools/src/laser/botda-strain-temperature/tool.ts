import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstShift: number;
  readonly secondShift: number;
  readonly firstStrainCoefficient: number;
  readonly firstTemperatureCoefficient: number;
  readonly secondStrainCoefficient: number;
  readonly secondTemperatureCoefficient: number;
}>;
export type Output = Readonly<{
  readonly strain: number;
  readonly temperatureChange: number;
}>;

export const calculate = (input: Input): Output => {
  const determinant =
    input.firstStrainCoefficient * input.secondTemperatureCoefficient -
    input.secondStrainCoefficient * input.firstTemperatureCoefficient;
  if (determinant === 0)
    simpleError(
      "firstStrainCoefficient",
      "Sensitivity matrix must be nonsingular.",
      "singular_system",
    );
  return {
    strain:
      (input.firstShift * input.secondTemperatureCoefficient -
        input.secondShift * input.firstTemperatureCoefficient) /
      determinant,
    temperatureChange:
      (input.firstStrainCoefficient * input.secondShift -
        input.secondStrainCoefficient * input.firstShift) /
      determinant,
  };
};

export const exampleInput = {
  firstShift: 5,
  secondShift: 4,
  firstStrainCoefficient: 1,
  firstTemperatureCoefficient: 2,
  secondStrainCoefficient: 2,
  secondTemperatureCoefficient: 1,
} satisfies Input;
export const exampleOutput = {
  strain: 1,
  temperatureChange: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstShift: input.firstShift as number,
      secondShift: input.secondShift as number,
      firstStrainCoefficient: input.firstStrainCoefficient as number,
      firstTemperatureCoefficient: input.firstTemperatureCoefficient as number,
      secondStrainCoefficient: input.secondStrainCoefficient as number,
      secondTemperatureCoefficient:
        input.secondTemperatureCoefficient as number,
    }),
  description:
    "Separate strain and temperature change from two calibrated distributed-sensing shifts.",
  id: "laser/botda-strain-temperature",
  inputs: [
    { id: "firstShift", label: "First measured shift", kind: "number" },
    { id: "secondShift", label: "Second measured shift", kind: "number" },
    {
      id: "firstStrainCoefficient",
      label: "First strain coefficient",
      kind: "number",
    },
    {
      id: "firstTemperatureCoefficient",
      label: "First temperature coefficient",
      kind: "number",
    },
    {
      id: "secondStrainCoefficient",
      label: "Second strain coefficient",
      kind: "number",
    },
    {
      id: "secondTemperatureCoefficient",
      label: "Second temperature coefficient",
      kind: "number",
    },
  ],
  outputs: [
    { id: "strain", label: "Solved strain", kind: "number" },
    {
      id: "temperatureChange",
      label: "Solved temperature change",
      kind: "number",
    },
  ],
  title: "BOTDA Strain and Temperature",
});

export const run = tool.execute;
export default tool;
