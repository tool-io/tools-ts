import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FiberNumericalApertureInput = Readonly<{
  readonly coreIndex: number;
  readonly claddingIndex: number;
}>;
export type FiberNumericalApertureOutput = Readonly<{
  readonly numericalAperture: number;
}>;

export const calculateFiberNumericalAperture = (
  x: FiberNumericalApertureInput,
): FiberNumericalApertureOutput => {
  if (!Number.isFinite(x.coreIndex) || x.coreIndex < 0)
    simpleError("coreIndex", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.claddingIndex) || x.claddingIndex < 0)
    simpleError("claddingIndex", "Provide a finite number at least 0.");
  if (x.coreIndex <= x.claddingIndex)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const numericalAperture = Math.sqrt(x.coreIndex ** 2 - x.claddingIndex ** 2);
  if (!Number.isFinite(numericalAperture))
    simpleError(
      "numericalAperture",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    numericalAperture: Object.is(numericalAperture, -0) ? 0 : numericalAperture,
  };
};

export const example = {
  input: { coreIndex: 1.5, claddingIndex: 1.4 },
  output: { numericalAperture: 0.5385164807134506 },
} satisfies ToolExample<
  FiberNumericalApertureInput,
  FiberNumericalApertureOutput
>;

export const tool = createSimpleTool({
  id: "electronics/fiber-numerical-aperture",
  title: "Fiber Numerical Aperture",
  description:
    "Numerical aperture of a step-index fiber in air from core and cladding refractive indices.",
  inputs: [
    { id: "coreIndex", kind: "number", label: "Core Index", minimum: 0 },
    {
      id: "claddingIndex",
      kind: "number",
      label: "Cladding Index",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "numericalAperture", kind: "number", label: "Numerical Aperture" },
  ],
  calculate: (input) =>
    calculateFiberNumericalAperture({
      coreIndex: input.coreIndex as number,
      claddingIndex: input.claddingIndex as number,
    }),
});
export const fiberNumericalApertureTool = tool;
export const runFiberNumericalAperture = tool.execute;
export default tool;
