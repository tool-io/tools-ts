import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FiberAttenuationCoefficientInput = Readonly<{
  readonly inputMilliwatts: number;
  readonly outputMilliwatts: number;
  readonly lengthKilometers: number;
}>;
export type FiberAttenuationCoefficientOutput = Readonly<{
  readonly attenuationDbPerKm: number;
}>;

export const calculateFiberAttenuationCoefficient = (
  x: FiberAttenuationCoefficientInput,
): FiberAttenuationCoefficientOutput => {
  if (!Number.isFinite(x.inputMilliwatts) || x.inputMilliwatts < 0)
    simpleError("inputMilliwatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.outputMilliwatts) || x.outputMilliwatts < 0)
    simpleError("outputMilliwatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lengthKilometers) || x.lengthKilometers < 0)
    simpleError("lengthKilometers", "Provide a finite number at least 0.");
  if (x.outputMilliwatts > x.inputMilliwatts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const attenuationDbPerKm =
    (10 * Math.log10(x.inputMilliwatts / x.outputMilliwatts)) /
    x.lengthKilometers;
  if (!Number.isFinite(attenuationDbPerKm))
    simpleError(
      "attenuationDbPerKm",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    attenuationDbPerKm: Object.is(attenuationDbPerKm, -0)
      ? 0
      : attenuationDbPerKm,
  };
};

export const example = {
  input: { inputMilliwatts: 10, outputMilliwatts: 5, lengthKilometers: 2 },
  output: { attenuationDbPerKm: 1.505149978319906 },
} satisfies ToolExample<
  FiberAttenuationCoefficientInput,
  FiberAttenuationCoefficientOutput
>;

export const tool = createSimpleTool({
  id: "electronics/fiber-attenuation-coefficient",
  title: "Fiber Attenuation Coefficient",
  description:
    "Average fiber attenuation in decibels per kilometer from launched and received optical power over known length.",
  inputs: [
    {
      id: "inputMilliwatts",
      kind: "number",
      label: "Input Milliwatts",
      unit: "mW",
      minimum: 0,
    },
    {
      id: "outputMilliwatts",
      kind: "number",
      label: "Output Milliwatts",
      unit: "mW",
      minimum: 0,
    },
    {
      id: "lengthKilometers",
      kind: "number",
      label: "Length Kilometers",
      unit: "km",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "attenuationDbPerKm",
      kind: "number",
      label: "Attenuation Db Per Km",
      unit: "dB/km",
    },
  ],
  calculate: (input) =>
    calculateFiberAttenuationCoefficient({
      inputMilliwatts: input.inputMilliwatts as number,
      outputMilliwatts: input.outputMilliwatts as number,
      lengthKilometers: input.lengthKilometers as number,
    }),
});
export const fiberAttenuationCoefficientTool = tool;
export const runFiberAttenuationCoefficient = tool.execute;
export default tool;
