import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerCoreAreaProductInput = {
  readonly currentDensityACm2?: number;
  readonly fluxSwingT?: number;
  readonly khFactor?: number;
  readonly powerVa: number;
  readonly switchingFreqKhz: number;
  readonly windowFillFactor?: number;
};

export type TransformerCoreAreaProductOutput = {
  readonly areaProductCm4: number;
};

export const transformerCoreAreaProductExample = {
  input: { powerVa: 10, switchingFreqKhz: 50 },
  output: { areaProductCm4: 4464.285714285714 },
} satisfies ToolExample<
  TransformerCoreAreaProductInput,
  TransformerCoreAreaProductOutput
>;

export const calculateTransformerCoreAreaProduct = (
  input: TransformerCoreAreaProductInput,
): TransformerCoreAreaProductOutput => {
  const khFactor = input.khFactor ?? 0.014;
  const currentDensityACm2 = input.currentDensityACm2 ?? 400;
  const windowFillFactor = input.windowFillFactor ?? 0.4;
  const fluxSwingT = input.fluxSwingT ?? 0.2;
  if (!(input.powerVa > 0))
    simpleError("powerVa", "Power rating must be positive.", "invalid_power");
  if (!(input.switchingFreqKhz > 0))
    simpleError(
      "switchingFreqKhz",
      "Switching frequency must be positive.",
      "invalid_frequency",
    );
  if (!(khFactor > 0))
    simpleError(
      "khFactor",
      "Topology coefficient must be positive.",
      "invalid_coefficient",
    );
  if (!(currentDensityACm2 > 0))
    simpleError(
      "currentDensityACm2",
      "Current density must be positive.",
      "invalid_density",
    );
  if (!(windowFillFactor > 0))
    simpleError(
      "windowFillFactor",
      "Window fill factor must be positive.",
      "invalid_fill",
    );
  if (!(fluxSwingT > 0))
    simpleError("fluxSwingT", "Flux swing must be positive.", "invalid_flux");
  return {
    areaProductCm4:
      (input.powerVa * 1e4) /
      (khFactor *
        input.switchingFreqKhz *
        currentDensityACm2 *
        windowFillFactor *
        fluxSwingT),
  };
};

export const transformerCoreAreaProductTool = createSimpleTool({
  calculate: (input) =>
    calculateTransformerCoreAreaProduct(
      input as unknown as TransformerCoreAreaProductInput,
    ),
  description:
    "Compute transformer core area product in cm^4 as (VA x 1e4) / (Kh x f x J x Kw x Bw); defaults Kh = 0.014, J = 400 A/cm^2, Kw = 0.4, Bw = 0.2 T.",
  id: "electronics/transformer-core-area-product",
  inputs: [
    {
      default: 400,
      id: "currentDensityACm2",
      kind: "number",
      label: "Current density",
      unit: "A/cm²",
      required: false,
    },
    {
      default: 0.2,
      id: "fluxSwingT",
      kind: "number",
      label: "Flux swing",
      unit: "T",
      required: false,
    },
    {
      default: 0.014,
      id: "khFactor",
      kind: "number",
      label: "Topology coefficient",
      required: false,
    },
    { id: "powerVa", kind: "number", label: "Power rating", unit: "VA" },
    {
      id: "switchingFreqKhz",
      kind: "number",
      label: "Switching frequency",
      unit: "kHz",
    },
    {
      default: 0.4,
      id: "windowFillFactor",
      kind: "number",
      label: "Window fill factor",
      required: false,
    },
  ],
  outputs: [
    {
      id: "areaProductCm4",
      kind: "number",
      label: "Area product",
      unit: "cm⁴",
    },
  ],
  title: "Core Area Product",
});
export const runTransformerCoreAreaProduct =
  transformerCoreAreaProductTool.execute;
export default transformerCoreAreaProductTool;
