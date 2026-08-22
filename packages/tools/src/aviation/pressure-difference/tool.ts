import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PressureDifferenceInput = {
  readonly qnhHpa: number;
};

export type PressureDifferenceOutput = {
  readonly pressureDifferenceHpa: number;
};

const STANDARD_PRESSURE_HPA = 1013.25;

export const pressureDifferenceExample = {
  input: { qnhHpa: 1032 },
  output: { pressureDifferenceHpa: 18.75 },
} satisfies ToolExample<PressureDifferenceInput, PressureDifferenceOutput>;

export const calculatePressureDifference = (
  input: PressureDifferenceInput,
): PressureDifferenceOutput => ({
  pressureDifferenceHpa: input.qnhHpa - STANDARD_PRESSURE_HPA,
});

export const pressureDifferenceTool = createSimpleTool({
  calculate: (input) =>
    calculatePressureDifference(input as unknown as PressureDifferenceInput),
  description:
    "Compare a QNH setting against the ISA standard pressure of 1013.25 hPa.",
  id: "aviation/pressure-difference",
  inputs: [
    {
      description: "QNH altimeter setting.",
      id: "qnhHpa",
      kind: "number",
      label: "QNH",
      maximum: 1100,
      minimum: 300,
      unit: "hPa",
    },
  ],
  outputs: [
    {
      description:
        "Signed difference from standard pressure; positive above standard, negative below.",
      format: "pressure-hpa",
      id: "pressureDifferenceHpa",
      kind: "number",
      label: "Pressure difference",
      unit: "hPa",
    },
  ],
  title: "Pressure Difference Calculator",
});
export const runPressureDifference = pressureDifferenceTool.execute;
export default pressureDifferenceTool;
