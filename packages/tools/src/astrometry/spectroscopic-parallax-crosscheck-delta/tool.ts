import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly spectroscopicParallaxMas: number;
  readonly photometricParallaxMas: number;
  readonly independentCombinedDifferenceSigmaMas: number;
}>;
export type Output = Readonly<{
  readonly signedSpectroscopicMinusPhotometricMas: number;
  readonly standardizedSignedDifference: number;
}>;
const inputFields = [
  {
    id: "spectroscopicParallaxMas",
    label: "Spectroscopic parallax mas",
    kind: "number",
  },
  {
    id: "photometricParallaxMas",
    label: "Photometric parallax mas",
    kind: "number",
  },
  {
    id: "independentCombinedDifferenceSigmaMas",
    label: "Independent combined difference sigma mas",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentCombinedDifferenceSigmaMas,
    "independentCombinedDifferenceSigmaMas",
  );
  return {
    signedSpectroscopicMinusPhotometricMas:
      input.spectroscopicParallaxMas - input.photometricParallaxMas,
    standardizedSignedDifference:
      (input.spectroscopicParallaxMas - input.photometricParallaxMas) /
      input.independentCombinedDifferenceSigmaMas,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spectroscopicParallaxMas: 3,
  photometricParallaxMas: 1,
  independentCombinedDifferenceSigmaMas: 2,
} satisfies Input;
export const exampleOutput = {
  signedSpectroscopicMinusPhotometricMas: 2,
  standardizedSignedDifference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/spectroscopic-parallax-crosscheck-delta",
  title: "Spectroscopic Photometric Parallax Cross-Check Delta Calculator",
  description:
    "Signed parallax cross check in same basis with independently covariance-aware DIFFERENCE sigma; no independent-error assumption or distance inversion. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedSpectroscopicMinusPhotometricMas",
      label: "Signed spectroscopic minus photometric mas",
      kind: "number",
    },
    {
      id: "standardizedSignedDifference",
      label: "Standardized signed difference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      spectroscopicParallaxMas: value.spectroscopicParallaxMas as number,
      photometricParallaxMas: value.photometricParallaxMas as number,
      independentCombinedDifferenceSigmaMas:
        value.independentCombinedDifferenceSigmaMas as number,
    }),
});
export const run = tool.execute;
export default tool;
