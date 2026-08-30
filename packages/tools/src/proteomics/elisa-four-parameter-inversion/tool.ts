import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly absorbance: number;
  readonly upperAsymptote: number;
  readonly lowerAsymptote: number;
  readonly midpointConcentration: number;
  readonly hillSlope: number;
}>;
export type Output = Readonly<{
  readonly concentration: number;
  readonly normalizedResponse: number;
}>;
export const calculate = (input: Input): Output => {
  const {
    absorbance: y,
    upperAsymptote: a,
    lowerAsymptote: d,
    midpointConcentration: c,
    hillSlope: b,
  } = input;
  if (a <= d || c <= 0 || b === 0)
    simpleError(
      "upperAsymptote",
      "Ordered asymptotes, positive midpoint, and nonzero signed slope required.",
    );
  if (y <= d || y >= a)
    simpleError(
      "absorbance",
      "Absorbance must lie strictly between the fitted asymptotes.",
    );
  const concentration = c * ((a - d) / (y - d) - 1) ** (1 / b);
  return { concentration, normalizedResponse: (y - d) / (a - d) };
};
export const exampleInput = {
  absorbance: 5,
  upperAsymptote: 10,
  lowerAsymptote: 0,
  midpointConcentration: 2,
  hillSlope: 1,
} satisfies Input;
export const exampleOutput = {
  concentration: 2,
  normalizedResponse: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/elisa-four-parameter-inversion",
  title: "ELISA Four Parameter Inversion",
  description:
    "Invert a caller-fitted four-parameter logistic ELISA standard curve.",
  inputs: [
    { id: "absorbance", label: "Absorbance", kind: "number" },
    { id: "upperAsymptote", label: "Upper asymptote", kind: "number" },
    { id: "lowerAsymptote", label: "Lower asymptote", kind: "number" },
    {
      id: "midpointConcentration",
      label: "Midpoint concentration",
      kind: "number",
    },
    { id: "hillSlope", label: "Hill slope", kind: "number" },
  ],
  outputs: [
    { id: "concentration", label: "Concentration", kind: "number" },
    { id: "normalizedResponse", label: "Normalized response", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      absorbance: value.absorbance as number,
      upperAsymptote: value.upperAsymptote as number,
      lowerAsymptote: value.lowerAsymptote as number,
      midpointConcentration: value.midpointConcentration as number,
      hillSlope: value.hillSlope as number,
    }),
});
export const run = tool.execute;
export default tool;
