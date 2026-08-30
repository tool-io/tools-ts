import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly secondHarmonicInPhase: number;
  readonly secondHarmonicQuadrature: number;
  readonly dcSignal: number;
}>;
export type Output = Readonly<{
  readonly secondHarmonicAmplitude: number;
  readonly secondHarmonicPhaseRadians: number;
  readonly normalizedErrorSignal: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.dcSignal === 0)
    simpleError("dcSignal", "DC signal must not be zero.", "invalid_reference");
  const secondHarmonicAmplitude = Math.hypot(
    input.secondHarmonicInPhase,
    input.secondHarmonicQuadrature,
  );
  return {
    secondHarmonicAmplitude,
    secondHarmonicPhaseRadians: Math.atan2(
      input.secondHarmonicQuadrature,
      input.secondHarmonicInPhase,
    ),
    normalizedErrorSignal: input.secondHarmonicInPhase / input.dcSignal,
  };
};

export const exampleInput = {
  secondHarmonicInPhase: 3,
  secondHarmonicQuadrature: 4,
  dcSignal: 10,
} satisfies Input;
export const exampleOutput = {
  secondHarmonicAmplitude: 5,
  secondHarmonicPhaseRadians: 0.9272952180016122,
  normalizedErrorSignal: 0.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      secondHarmonicInPhase: input.secondHarmonicInPhase as number,
      secondHarmonicQuadrature: input.secondHarmonicQuadrature as number,
      dcSignal: input.dcSignal as number,
    }),
  description:
    "Resolve a wavelength-modulation 2f signal into amplitude, phase, and normalized lock error.",
  id: "laser/wms-2f-error-signal",
  inputs: [
    {
      id: "secondHarmonicInPhase",
      label: "2f in-phase component",
      kind: "number",
    },
    {
      id: "secondHarmonicQuadrature",
      label: "2f quadrature component",
      kind: "number",
    },
    { id: "dcSignal", label: "DC absorption signal", kind: "number" },
  ],
  outputs: [
    {
      id: "secondHarmonicAmplitude",
      label: "2f amplitude",
      kind: "number",
      minimum: 0,
    },
    {
      id: "secondHarmonicPhaseRadians",
      label: "2f phase",
      kind: "number",
      unit: "rad",
    },
    {
      id: "normalizedErrorSignal",
      label: "DC-normalized 2f error signal",
      kind: "number",
    },
  ],
  title: "WMS 2f Error Signal",
});

export const run = tool.execute;
export default tool;
