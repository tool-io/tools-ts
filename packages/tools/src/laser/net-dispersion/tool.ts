import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly dispersionPsPerNmKm: readonly number[];
  readonly lengthsKilometers: readonly number[];
}>;
export type Output = Readonly<{
  readonly netDispersionPsPerNm: number;
  readonly dispersionSign: string;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.dispersionPsPerNmKm.length === 0 ||
    input.dispersionPsPerNmKm.length !== input.lengthsKilometers.length ||
    input.lengthsKilometers.some((value) => value < 0)
  )
    simpleError(
      "dispersionPsPerNmKm",
      "Dispersion and length lists must be aligned and nonempty.",
      "invalid_segments",
    );
  const netDispersionPsPerNm = input.dispersionPsPerNmKm.reduce(
    (sum, value, index) => sum + value * input.lengthsKilometers[index],
    0,
  );
  return {
    netDispersionPsPerNm,
    dispersionSign:
      netDispersionPsPerNm === 0
        ? "zero"
        : netDispersionPsPerNm > 0
          ? "normal"
          : "anomalous",
  };
};

export const exampleInput = {
  dispersionPsPerNmKm: [20, -10],
  lengthsKilometers: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  netDispersionPsPerNm: 15,
  dispersionSign: "normal",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      dispersionPsPerNmKm: input.dispersionPsPerNmKm as readonly number[],
      lengthsKilometers: input.lengthsKilometers as readonly number[],
    }),
  description:
    "Sum segment dispersion-length products and report the net dispersion sign.",
  id: "laser/net-dispersion",
  inputs: [
    {
      id: "dispersionPsPerNmKm",
      label: "Segment dispersion coefficients",
      kind: "numberList",
      unit: "ps/(nm·km)",
    },
    {
      id: "lengthsKilometers",
      label: "Segment lengths",
      kind: "numberList",
      unit: "km",
    },
  ],
  outputs: [
    {
      id: "netDispersionPsPerNm",
      label: "Net cavity dispersion",
      kind: "number",
      unit: "ps/nm",
    },
    {
      id: "dispersionSign",
      label: "Net dispersion sign",
      kind: "string",
      enum: ["normal", "anomalous", "zero"],
    },
  ],
  title: "Net Dispersion",
});

export const run = tool.execute;
export default tool;
