import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MicrostripImpedanceApproxInput = {
  readonly dielectricConstEr: number;
  readonly heightMm: number;
  readonly traceThicknessMm: number;
  readonly widthMm: number;
};

export type MicrostripImpedanceApproxOutput = {
  readonly microstripImpedanceOhms: number;
};

export const microstripImpedanceApproxExample = {
  input: {
    dielectricConstEr: 4.5,
    heightMm: 1.6,
    traceThicknessMm: 0.035,
    widthMm: 2,
  },
  output: { microstripImpedanceOhms: 63.22783757165688 },
} satisfies ToolExample<
  MicrostripImpedanceApproxInput,
  MicrostripImpedanceApproxOutput
>;

export const calculateMicrostripImpedanceApprox = (
  input: MicrostripImpedanceApproxInput,
): MicrostripImpedanceApproxOutput => {
  if (!(input.dielectricConstEr > 1))
    simpleError(
      "dielectricConstEr",
      "Relative permittivity must be greater than one.",
      "invalid_permittivity",
    );
  if (!(input.heightMm > 0) || !(input.widthMm > 0))
    simpleError(
      "heightMm",
      "Trace height and width must be positive.",
      "invalid_geometry",
    );
  if (!(input.traceThicknessMm >= 0))
    simpleError(
      "traceThicknessMm",
      "Trace thickness cannot be negative.",
      "invalid_thickness",
    );
  return {
    microstripImpedanceOhms:
      (87 / Math.sqrt(input.dielectricConstEr + 1.41)) *
      Math.log(
        (5.98 * input.heightMm) /
          (0.8 * input.widthMm + input.traceThicknessMm),
      ),
  };
};

export const microstripImpedanceApproxTool = createSimpleTool({
  calculate: (input) =>
    calculateMicrostripImpedanceApprox(
      input as unknown as MicrostripImpedanceApproxInput,
    ),
  description:
    "Approximate microstrip characteristic impedance as (87 / sqrt(er + 1.41)) x ln(5.98 x h / (0.8 x w + t)).",
  id: "electronics/microstrip-impedance-approx",
  inputs: [
    {
      id: "dielectricConstEr",
      kind: "number",
      label: "Dielectric constant",
    },
    { id: "heightMm", kind: "number", label: "Substrate height", unit: "mm" },
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
      id: "microstripImpedanceOhms",
      kind: "number",
      label: "Microstrip impedance",
      unit: "Ω",
    },
  ],
  title: "Microstrip Z Approx",
});
export const runMicrostripImpedanceApprox =
  microstripImpedanceApproxTool.execute;
export default microstripImpedanceApproxTool;
