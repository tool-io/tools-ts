import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CoplanarWaveguideImpedanceInput = {
  readonly erEffective?: number;
  readonly gapMm: number;
  readonly traceWidthMm: number;
};

export type CoplanarWaveguideImpedanceOutput = {
  readonly coplanarImpedanceOhms: number;
};

export const coplanarWaveguideImpedanceExample = {
  input: { gapMm: 0.2, traceWidthMm: 0.5 },
  output: { coplanarImpedanceOhms: 59.22243078066029 },
} satisfies ToolExample<
  CoplanarWaveguideImpedanceInput,
  CoplanarWaveguideImpedanceOutput
>;

export const calculateCoplanarWaveguideImpedance = (
  input: CoplanarWaveguideImpedanceInput,
): CoplanarWaveguideImpedanceOutput => {
  const erEffective = input.erEffective ?? 4;
  if (!(erEffective > 1))
    simpleError(
      "erEffective",
      "Effective permittivity must be greater than one.",
      "invalid_permittivity",
    );
  if (!(input.traceWidthMm > 0))
    simpleError(
      "traceWidthMm",
      "Trace width must be positive.",
      "invalid_geometry",
    );
  if (!(input.gapMm >= 0))
    simpleError("gapMm", "Gap cannot be negative.", "invalid_gap");
  const a = input.traceWidthMm / 2 + input.gapMm;
  const b = input.traceWidthMm / 2;
  const logArgument = (4 * a) / b;
  if (!(logArgument > 1))
    simpleError(
      "traceWidthMm",
      "The logarithm argument must exceed one.",
      "invalid_geometry",
    );
  return {
    coplanarImpedanceOhms:
      (60 / Math.sqrt(erEffective)) * Math.log(logArgument),
  };
};

export const coplanarWaveguideImpedanceTool = createSimpleTool({
  calculate: (input) =>
    calculateCoplanarWaveguideImpedance(
      input as unknown as CoplanarWaveguideImpedanceInput,
    ),
  description:
    "Approximate coplanar waveguide impedance as (60 / sqrt(er_eff)) x ln(4 x a / b) with a = w/2 + gap and b = w/2; er_eff defaults to 4.",
  id: "electronics/coplanar-waveguide-impedance",
  inputs: [
    {
      default: 4,
      id: "erEffective",
      kind: "number",
      label: "Effective permittivity",
      required: false,
    },
    { id: "gapMm", kind: "number", label: "Trace-to-ground gap", unit: "mm" },
    { id: "traceWidthMm", kind: "number", label: "Trace width", unit: "mm" },
  ],
  outputs: [
    {
      id: "coplanarImpedanceOhms",
      kind: "number",
      label: "CPW impedance",
      unit: "Ω",
    },
  ],
  title: "CPW Impedance Approx",
});
export const runCoplanarWaveguideImpedance =
  coplanarWaveguideImpedanceTool.execute;
export default coplanarWaveguideImpedanceTool;
