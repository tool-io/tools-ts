import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly initialMainPulseEnergy: number;
  readonly initialPrepulseEnergy: number;
  readonly mainPulseReflectivity: number;
  readonly prepulseReflectivity: number;
}>;
export type Output = Readonly<{
  readonly initialContrast: number;
  readonly reflectedContrast: number;
  readonly contrastImprovement: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.initialPrepulseEnergy <= 0 || input.prepulseReflectivity <= 0)
    simpleError(
      "initialPrepulseEnergy",
      "Prepulse energy and reflectivity must be positive.",
      "invalid_prepulse",
    );
  const initialContrast =
    input.initialMainPulseEnergy / input.initialPrepulseEnergy;
  const reflectedContrast =
    (input.initialMainPulseEnergy * input.mainPulseReflectivity) /
    (input.initialPrepulseEnergy * input.prepulseReflectivity);
  return {
    initialContrast,
    reflectedContrast,
    contrastImprovement: reflectedContrast / initialContrast,
  };
};

export const exampleInput = {
  initialMainPulseEnergy: 100,
  initialPrepulseEnergy: 1,
  mainPulseReflectivity: 0.5,
  prepulseReflectivity: 0.01,
} satisfies Input;
export const exampleOutput = {
  initialContrast: 100,
  reflectedContrast: 5000,
  contrastImprovement: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      initialMainPulseEnergy: input.initialMainPulseEnergy as number,
      initialPrepulseEnergy: input.initialPrepulseEnergy as number,
      mainPulseReflectivity: input.mainPulseReflectivity as number,
      prepulseReflectivity: input.prepulseReflectivity as number,
    }),
  description:
    "Calculate plasma-mirror pulse-contrast improvement from differential reflectivity.",
  id: "laser/plasma-mirror-contrast",
  inputs: [
    {
      id: "initialMainPulseEnergy",
      label: "Initial main-pulse energy",
      kind: "number",
      minimum: 0,
    },
    {
      id: "initialPrepulseEnergy",
      label: "Initial prepulse energy",
      kind: "number",
      minimum: 0,
    },
    {
      id: "mainPulseReflectivity",
      label: "Main-pulse reflectivity",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "prepulseReflectivity",
      label: "Prepulse reflectivity",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "initialContrast",
      label: "Initial main-to-prepulse contrast",
      kind: "number",
      minimum: 0,
    },
    {
      id: "reflectedContrast",
      label: "Reflected main-to-prepulse contrast",
      kind: "number",
      minimum: 0,
    },
    {
      id: "contrastImprovement",
      label: "Contrast improvement factor",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Plasma-Mirror Contrast",
});

export const run = tool.execute;
export default tool;
