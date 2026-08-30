import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly bandIntegratedIntensity: number;
  readonly localBackgroundIntensity: number;
}>;
export type Output = Readonly<{
  readonly correctedBandIntensity: number;
  readonly backgroundFraction: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.bandIntegratedIntensity <= 0 || input.localBackgroundIntensity < 0)
    simpleError(
      "bandIntegratedIntensity",
      "Positive band intensity and nonnegative background required.",
    );
  return {
    correctedBandIntensity: Math.max(
      0,
      input.bandIntegratedIntensity - input.localBackgroundIntensity,
    ),
    backgroundFraction:
      input.localBackgroundIntensity / input.bandIntegratedIntensity,
  };
};
export const exampleInput = {
  bandIntegratedIntensity: 100,
  localBackgroundIntensity: 20,
} satisfies Input;
export const exampleOutput = {
  correctedBandIntensity: 80,
  backgroundFraction: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/western-band-background-correction",
  title: "Western Band Background Correction",
  description:
    "Subtract local western-blot band background before lane normalization.",
  inputs: [
    {
      id: "bandIntegratedIntensity",
      label: "Band integrated intensity",
      kind: "number",
    },
    {
      id: "localBackgroundIntensity",
      label: "Local background intensity",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "correctedBandIntensity",
      label: "Corrected band intensity",
      kind: "number",
    },
    { id: "backgroundFraction", label: "Background fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      bandIntegratedIntensity: value.bandIntegratedIntensity as number,
      localBackgroundIntensity: value.localBackgroundIntensity as number,
    }),
});
export const run = tool.execute;
export default tool;
