import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApdExcessNoiseFactorInput = Readonly<{
  readonly multiplicationFactor: number;
  readonly ionizationRatio: number;
}>;
export type ApdExcessNoiseFactorOutput = Readonly<{
  readonly excessNoiseFactor: number;
}>;

export const calculateApdExcessNoiseFactor = (
  x: ApdExcessNoiseFactorInput,
): ApdExcessNoiseFactorOutput => {
  if (!Number.isFinite(x.multiplicationFactor) || x.multiplicationFactor < 1)
    simpleError("multiplicationFactor", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.ionizationRatio) || x.ionizationRatio < 0)
    simpleError("ionizationRatio", "Provide a finite number at least 0.");
  if (!(
    x.multiplicationFactor >= 1 &&
    x.ionizationRatio >= 0 &&
    x.ionizationRatio <= 1
  ))
    simpleError("input", "Gain must be at least one and ratio in [0,1].");
  const excessNoiseFactor =
    x.multiplicationFactor * x.ionizationRatio +
    (2 - 1 / x.multiplicationFactor) * (1 - x.ionizationRatio);
  if (!Number.isFinite(excessNoiseFactor))
    simpleError("excessNoiseFactor", "The inputs produce an invalid result.");
  return {
    excessNoiseFactor: Object.is(excessNoiseFactor, -0) ? 0 : excessNoiseFactor,
  };
};

export const example = {
  input: { multiplicationFactor: 10, ionizationRatio: 0.1 },
  output: { excessNoiseFactor: 2.71 },
} satisfies ToolExample<ApdExcessNoiseFactorInput, ApdExcessNoiseFactorOutput>;

export const tool = createSimpleTool({
  id: "electronics/apd-excess-noise-factor",
  title: "APD Excess Noise Factor",
  description:
    "Calculate electron-injection APD excess noise factor from gain and ionization-rate ratio using the McIntyre uniform-field model.",
  inputs: [
    {
      id: "multiplicationFactor",
      kind: "number",
      label: "Avalanche multiplication",
      minimum: 1,
    },
    {
      id: "ionizationRatio",
      kind: "number",
      label: "Hole-to-electron ionization ratio",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "excessNoiseFactor", kind: "number", label: "Excess noise factor" },
  ],
  calculate: (input) =>
    calculateApdExcessNoiseFactor({
      multiplicationFactor: input.multiplicationFactor as number,
      ionizationRatio: input.ionizationRatio as number,
    }),
});
export const apdExcessNoiseFactorTool = tool;
export const runApdExcessNoiseFactor = tool.execute;
export default tool;
