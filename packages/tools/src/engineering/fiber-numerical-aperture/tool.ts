import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FiberNumericalApertureInput = Readonly<{
  readonly coreRefractiveIndex: number;
  readonly claddingRefractiveIndex: number;
}>;
export type FiberNumericalApertureOutput = Readonly<{
  readonly numericalAperture: number;
}>;

export const calculateFiberNumericalAperture = (
  x: FiberNumericalApertureInput,
): FiberNumericalApertureOutput => {
  if (!Number.isFinite(x.coreRefractiveIndex) || x.coreRefractiveIndex < 0)
    simpleError("coreRefractiveIndex", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.claddingRefractiveIndex) ||
    x.claddingRefractiveIndex < 0
  )
    simpleError(
      "claddingRefractiveIndex",
      "Provide a finite number at least 0.",
    );
  if (x.claddingRefractiveIndex >= x.coreRefractiveIndex)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const numericalAperture = Math.sqrt(
    x.coreRefractiveIndex ** 2 - x.claddingRefractiveIndex ** 2,
  );
  if (!Number.isFinite(numericalAperture))
    simpleError(
      "numericalAperture",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    numericalAperture: Object.is(numericalAperture, -0) ? 0 : numericalAperture,
  };
};

export const example = {
  input: { coreRefractiveIndex: 1.48, claddingRefractiveIndex: 1.46 },
  output: { numericalAperture: 0.2424871130596432 },
} satisfies ToolExample<
  FiberNumericalApertureInput,
  FiberNumericalApertureOutput
>;

export const tool = createSimpleTool({
  id: "engineering/fiber-numerical-aperture",
  title: "Fiber Numerical Aperture",
  description:
    "Step-index fiber numerical aperture in air from core and cladding refractive indices: √(ncore²−nclad²).",
  inputs: [
    {
      id: "coreRefractiveIndex",
      kind: "number",
      label: "Core Refractive Index",
      minimum: 0,
    },
    {
      id: "claddingRefractiveIndex",
      kind: "number",
      label: "Cladding Refractive Index",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "numericalAperture", kind: "number", label: "Numerical Aperture" },
  ],
  calculate: (input) =>
    calculateFiberNumericalAperture({
      coreRefractiveIndex: input.coreRefractiveIndex as number,
      claddingRefractiveIndex: input.claddingRefractiveIndex as number,
    }),
});
export const fiberNumericalApertureTool = tool;
export const runFiberNumericalAperture = tool.execute;
export default tool;
