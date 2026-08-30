import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FiberCutoffWavelengthInput = Readonly<{
  readonly coreRadiusMeters: number;
  readonly numericalAperture: number;
}>;
export type FiberCutoffWavelengthOutput = Readonly<{
  readonly cutoffMeters: number;
}>;

export const calculateFiberCutoffWavelength = (
  x: FiberCutoffWavelengthInput,
): FiberCutoffWavelengthOutput => {
  if (!Number.isFinite(x.coreRadiusMeters) || x.coreRadiusMeters < 0)
    simpleError("coreRadiusMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.numericalAperture) || x.numericalAperture < 0)
    simpleError("numericalAperture", "Provide a finite number at least 0.");
  const cutoffMeters =
    (2 * Math.PI * x.coreRadiusMeters * x.numericalAperture) / 2.405;
  if (!Number.isFinite(cutoffMeters))
    simpleError(
      "cutoffMeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return { cutoffMeters: Object.is(cutoffMeters, -0) ? 0 : cutoffMeters };
};

export const example = {
  input: { coreRadiusMeters: 0.000004, numericalAperture: 0.1 },
  output: { cutoffMeters: 0.0000010450204253105342 },
} satisfies ToolExample<
  FiberCutoffWavelengthInput,
  FiberCutoffWavelengthOutput
>;

export const tool = createSimpleTool({
  id: "electronics/fiber-cutoff-wavelength",
  title: "Fiber Cutoff Wavelength",
  description:
    "LP11 cutoff wavelength of an ideal weakly guiding step-index fiber, using V=2.405.",
  inputs: [
    {
      id: "coreRadiusMeters",
      kind: "number",
      label: "Core Radius Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "numericalAperture",
      kind: "number",
      label: "Numerical Aperture",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "cutoffMeters", kind: "number", label: "Cutoff Meters", unit: "m" },
  ],
  calculate: (input) =>
    calculateFiberCutoffWavelength({
      coreRadiusMeters: input.coreRadiusMeters as number,
      numericalAperture: input.numericalAperture as number,
    }),
});
export const fiberCutoffWavelengthTool = tool;
export const runFiberCutoffWavelength = tool.execute;
export default tool;
