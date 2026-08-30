import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly offsetX: number;
  readonly offsetY: number;
  readonly termPowers: readonly (readonly number[])[];
  readonly xCoefficients: readonly number[];
  readonly yCoefficients: readonly number[];
  readonly polynomialOrder: number;
}>;
export type Output = Readonly<{
  readonly xDistortion: number;
  readonly yDistortion: number;
  readonly distortedOffsetX: number;
  readonly distortedOffsetY: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.termPowers, input.xCoefficients, "termPowers");
  aligned(input.termPowers, input.yCoefficients, "termPowers");
  count(input.polynomialOrder, "polynomialOrder", 2);
  if (input.polynomialOrder > 9 || input.termPowers.length > 128)
    simpleError(
      "polynomialOrder",
      "SIP order must be 2–9 and at most 128 terms.",
    );
  const keys = new Set<string>();
  let xDistortion = 0,
    yDistortion = 0;
  input.termPowers.forEach((row, i) => {
    if (row.length !== 2)
      simpleError("termPowers", "Two exponent components per term required.");
    const [p, q] = row;
    count(p, "termPowers");
    count(q, "termPowers");
    const key = `${p},${q}`;
    if (p + q < 2 || p + q > input.polynomialOrder || keys.has(key))
      simpleError(
        "termPowers",
        "Distinct nonlinear terms within the supplied total polynomial order required.",
      );
    keys.add(key);
    const term = input.offsetX ** p * input.offsetY ** q;
    xDistortion += input.xCoefficients[i] * term;
    yDistortion += input.yCoefficients[i] * term;
  });
  return {
    xDistortion,
    yDistortion,
    distortedOffsetX: input.offsetX + xDistortion,
    distortedOffsetY: input.offsetY + yDistortion,
  };
};
export const exampleInput = {
  offsetX: 2,
  offsetY: 3,
  termPowers: [
    [2, 0],
    [1, 1],
  ],
  xCoefficients: [0.1, 0.2],
  yCoefficients: [0, 0.1],
  polynomialOrder: 2,
} satisfies Input;
export const exampleOutput = {
  xDistortion: 1.6,
  yDistortion: 0.6,
  distortedOffsetX: 3.6,
  distortedOffsetY: 3.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/sip-distortion-evaluation",
  title: "Sip Distortion Evaluation",
  description:
    "Validate and evaluate forward SIP distortion terms for reference-pixel offsets; linear and constant terms belong in WCS, not SIP.",
  inputs: [
    { id: "offsetX", label: "Offset x", kind: "number" },
    { id: "offsetY", label: "Offset y", kind: "number" },
    { id: "termPowers", label: "Term powers", kind: "matrix" },
    { id: "xCoefficients", label: "X coefficients", kind: "numberList" },
    { id: "yCoefficients", label: "Y coefficients", kind: "numberList" },
    { id: "polynomialOrder", label: "Polynomial order", kind: "integer" },
  ],
  outputs: [
    { id: "xDistortion", label: "X distortion", kind: "number" },
    { id: "yDistortion", label: "Y distortion", kind: "number" },
    { id: "distortedOffsetX", label: "Distorted offset x", kind: "number" },
    { id: "distortedOffsetY", label: "Distorted offset y", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      offsetX: value.offsetX as number,
      offsetY: value.offsetY as number,
      termPowers: value.termPowers as readonly (readonly number[])[],
      xCoefficients: value.xCoefficients as readonly number[],
      yCoefficients: value.yCoefficients as readonly number[],
      polynomialOrder: value.polynomialOrder as number,
    }),
});
export const run = tool.execute;
export default tool;
