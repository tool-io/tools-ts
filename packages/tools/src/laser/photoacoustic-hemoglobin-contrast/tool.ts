import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstSignal: number;
  readonly secondSignal: number;
  readonly oxyCoefficientFirst: number;
  readonly deoxyCoefficientFirst: number;
  readonly oxyCoefficientSecond: number;
  readonly deoxyCoefficientSecond: number;
}>;
export type Output = Readonly<{
  readonly oxyhemoglobin: number;
  readonly deoxyhemoglobin: number;
  readonly oxygenSaturation: number;
}>;

export const calculate = (input: Input): Output => {
  const determinant =
    input.oxyCoefficientFirst * input.deoxyCoefficientSecond -
    input.oxyCoefficientSecond * input.deoxyCoefficientFirst;
  if (determinant === 0)
    simpleError(
      "oxyCoefficientFirst",
      "Spectral coefficient matrix must be nonsingular.",
      "singular_matrix",
    );
  const oxyhemoglobin =
    (input.firstSignal * input.deoxyCoefficientSecond -
      input.secondSignal * input.deoxyCoefficientFirst) /
    determinant;
  const deoxyhemoglobin =
    (input.oxyCoefficientFirst * input.secondSignal -
      input.oxyCoefficientSecond * input.firstSignal) /
    determinant;
  const total = oxyhemoglobin + deoxyhemoglobin;
  if (total === 0)
    simpleError(
      "firstSignal",
      "Solved hemoglobin total must be nonzero.",
      "zero_total",
    );
  return {
    oxyhemoglobin,
    deoxyhemoglobin,
    oxygenSaturation: oxyhemoglobin / total,
  };
};

export const exampleInput = {
  firstSignal: 5,
  secondSignal: 4,
  oxyCoefficientFirst: 1,
  deoxyCoefficientFirst: 2,
  oxyCoefficientSecond: 2,
  deoxyCoefficientSecond: 1,
} satisfies Input;
export const exampleOutput = {
  oxyhemoglobin: 1,
  deoxyhemoglobin: 2,
  oxygenSaturation: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstSignal: input.firstSignal as number,
      secondSignal: input.secondSignal as number,
      oxyCoefficientFirst: input.oxyCoefficientFirst as number,
      deoxyCoefficientFirst: input.deoxyCoefficientFirst as number,
      oxyCoefficientSecond: input.oxyCoefficientSecond as number,
      deoxyCoefficientSecond: input.deoxyCoefficientSecond as number,
    }),
  description:
    "Unmix two-wavelength photoacoustic signals into hemoglobin contributions and saturation.",
  id: "laser/photoacoustic-hemoglobin-contrast",
  inputs: [
    {
      id: "firstSignal",
      label: "First-wavelength photoacoustic signal",
      kind: "number",
    },
    {
      id: "secondSignal",
      label: "Second-wavelength photoacoustic signal",
      kind: "number",
    },
    {
      id: "oxyCoefficientFirst",
      label: "Oxyhemoglobin coefficient at first wavelength",
      kind: "number",
    },
    {
      id: "deoxyCoefficientFirst",
      label: "Deoxyhemoglobin coefficient at first wavelength",
      kind: "number",
    },
    {
      id: "oxyCoefficientSecond",
      label: "Oxyhemoglobin coefficient at second wavelength",
      kind: "number",
    },
    {
      id: "deoxyCoefficientSecond",
      label: "Deoxyhemoglobin coefficient at second wavelength",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "oxyhemoglobin",
      label: "Solved oxyhemoglobin contribution",
      kind: "number",
    },
    {
      id: "deoxyhemoglobin",
      label: "Solved deoxyhemoglobin contribution",
      kind: "number",
    },
    {
      id: "oxygenSaturation",
      label: "Oxygen saturation fraction",
      kind: "number",
    },
  ],
  title: "Photoacoustic Hemoglobin Contrast",
});

export const run = tool.execute;
export default tool;
