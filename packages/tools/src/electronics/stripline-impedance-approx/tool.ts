import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StriplineImpedanceApproxInput = {
  readonly dielectricConstEr: number;
  readonly heightMm: number;
  readonly traceThicknessMm: number;
  readonly widthMm: number;
};

export type StriplineImpedanceApproxOutput = {
  readonly striplineImpedanceOhms: number;
};

export const striplineImpedanceApproxExample = {
  input: {
    dielectricConstEr: 4.5,
    heightMm: 0.8,
    traceThicknessMm: 0.035,
    widthMm: 0.5,
  },
  output: { striplineImpedanceOhms: 35.39232748827907 },
} satisfies ToolExample<
  StriplineImpedanceApproxInput,
  StriplineImpedanceApproxOutput
>;

export const calculateStriplineImpedanceApprox = (
  input: StriplineImpedanceApproxInput,
): StriplineImpedanceApproxOutput => {
  if (!(input.dielectricConstEr > 1))
    simpleError(
      "dielectricConstEr",
      "Relative permittivity must be greater than one.",
      "invalid_permittivity",
    );
  if (!(input.heightMm > 0) || !(input.widthMm > 0))
    simpleError(
      "heightMm",
      "Plane separation and trace width must be positive.",
      "invalid_geometry",
    );
  if (!(input.traceThicknessMm >= 0))
    simpleError(
      "traceThicknessMm",
      "Trace thickness cannot be negative.",
      "invalid_thickness",
    );
  const logArgument =
    (4 * input.heightMm) /
    (0.67 * Math.PI * (0.8 * input.widthMm + input.traceThicknessMm));
  if (!(logArgument > 0))
    simpleError(
      "widthMm",
      "The logarithm argument must be positive.",
      "invalid_geometry",
    );
  return {
    striplineImpedanceOhms:
      (60 / Math.sqrt(input.dielectricConstEr)) * Math.log(logArgument),
  };
};

export const striplineImpedanceApproxTool = createSimpleTool({
  calculate: (input) =>
    calculateStriplineImpedanceApprox(
      input as unknown as StriplineImpedanceApproxInput,
    ),
  description:
    "Approximate symmetric stripline impedance as (60 / sqrt(er)) x ln(4 x h / (0.67 x pi x (0.8 x w + t))).",
  id: "electronics/stripline-impedance-approx",
  inputs: [
    {
      id: "dielectricConstEr",
      kind: "number",
      label: "Dielectric constant",
    },
    {
      id: "heightMm",
      kind: "number",
      label: "Plane-to-trace height",
      unit: "mm",
    },
    { id: "widthMm", kind: "number", label: "Trace width", unit: "mm" },
    {
      id: "traceThicknessMm",
      kind: "number",
      label: "Trace thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "striplineImpedanceOhms",
      kind: "number",
      label: "Stripline impedance",
      unit: "Ω",
    },
  ],
  title: "Stripline Z Approx",
});
export const runStriplineImpedanceApprox = striplineImpedanceApproxTool.execute;
export default striplineImpedanceApproxTool;
