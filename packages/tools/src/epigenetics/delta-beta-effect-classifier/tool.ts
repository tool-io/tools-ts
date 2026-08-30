import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly controlBeta: number;
  readonly treatmentBeta: number;
  readonly smallEffectAt: number;
  readonly largeEffectAt: number;
}>;
export type Output = Readonly<{
  readonly deltaBeta: number;
  readonly absoluteEffect: number;
  readonly effectBand: string;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.controlBeta < 0 ||
    input.controlBeta > 1 ||
    input.treatmentBeta < 0 ||
    input.treatmentBeta > 1 ||
    input.smallEffectAt < 0 ||
    input.smallEffectAt > input.largeEffectAt
  )
    simpleError(
      "controlBeta",
      "Beta values and ordered thresholds are required.",
    );
  const deltaBeta = input.treatmentBeta - input.controlBeta,
    absoluteEffect = Math.abs(deltaBeta);
  return {
    deltaBeta,
    absoluteEffect,
    effectBand:
      absoluteEffect >= input.largeEffectAt
        ? "large"
        : absoluteEffect >= input.smallEffectAt
          ? "moderate"
          : "small",
  };
};

export const exampleInput = {
  controlBeta: 0.2,
  treatmentBeta: 0.5,
  smallEffectAt: 0.05,
  largeEffectAt: 0.2,
} satisfies Input;
export const exampleOutput = {
  deltaBeta: 0.3,
  absoluteEffect: 0.3,
  effectBand: "large",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/delta-beta-effect-classifier",
  title: "Delta Beta Effect Classifier",
  description:
    "Classify differential methylation effect using caller-supplied beta thresholds.",
  inputs: [
    { id: "controlBeta", kind: "number", label: "Control beta" },
    { id: "treatmentBeta", kind: "number", label: "Treatment beta" },
    { id: "smallEffectAt", kind: "number", label: "Small effect at" },
    { id: "largeEffectAt", kind: "number", label: "Large effect at" },
  ],
  outputs: [
    { id: "deltaBeta", kind: "number", label: "Delta beta" },
    { id: "absoluteEffect", kind: "number", label: "Absolute effect" },
    {
      id: "effectBand",
      kind: "string",
      label: "Effect band",
      enum: ["small", "moderate", "large"],
    },
  ],
  calculate: (value) =>
    calculate({
      controlBeta: value.controlBeta as number,
      treatmentBeta: value.treatmentBeta as number,
      smallEffectAt: value.smallEffectAt as number,
      largeEffectAt: value.largeEffectAt as number,
    }),
});
export const run = tool.execute;
export default tool;
