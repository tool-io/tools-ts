import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    outputPowerW: 100,
    currentDensityCircularMilsPerA: 750,
    topologyConstant: 0.001,
    maximumFluxDensityGauss: 2000,
    frequencyHz: 100000,
  },
  output: { areaProductCm4: 0.375 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/ferrite-core-selection-area-product",
  title: "Ferrite Core Area Product",
  description:
    "Estimate required ferrite core window-area × cross-section from the Magnetics design form WaAc=Pout·Dcma/(Kt·Bmax·f). Enter circular-mils-per-ampere current-density allowance, gauss, hertz, and the topology constant from the same design method; output is cm⁴.",
  inputs: [
    {
      id: "outputPowerW",
      kind: "number",
      label: "Output power (W)",
      minimum: 0,
    },
    {
      id: "currentDensityCircularMilsPerA",
      kind: "number",
      label: "Current-density allowance (circular mil/A)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "topologyConstant",
      kind: "number",
      label: "Topology constant Kt",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "maximumFluxDensityGauss",
      kind: "number",
      label: "Peak flux density (gauss)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "frequencyHz",
      kind: "number",
      label: "Frequency (Hz)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "areaProductCm4", kind: "number", label: "Area Product Cm4" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      areaProductCm4:
        (i.outputPowerW * i.currentDensityCircularMilsPerA) /
        (i.topologyConstant * i.maximumFluxDensityGauss * i.frequencyHz),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type FerriteCoreSelectionAreaProductInput = Readonly<
  typeof example.input
>;
export type FerriteCoreSelectionAreaProductOutput = Readonly<
  typeof example.output
>;
export const ferriteCoreSelectionAreaProductTool = tool;
export const runFerriteCoreSelectionAreaProduct = tool.execute;
export default tool;
