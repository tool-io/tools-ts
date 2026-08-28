import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PcbTraceResistanceInput = {
  readonly lengthMm: number;
  readonly thicknessUm: number;
  readonly widthMm: number;
};

export type PcbTraceResistanceOutput = {
  readonly traceResistanceMilliohms: number;
};

const RHO_CU_OHM_M = 1.7e-8;

export const pcbTraceResistanceExample = {
  input: { lengthMm: 50, thicknessUm: 35, widthMm: 1 },
  output: { traceResistanceMilliohms: 24.28571428571429 },
} satisfies ToolExample<PcbTraceResistanceInput, PcbTraceResistanceOutput>;

export const pcbTraceResistanceTool = createSimpleTool({
  calculate: (input) => {
    const lengthMm = input.lengthMm as number;
    const widthMm = input.widthMm as number;
    const thicknessUm = input.thicknessUm as number;
    if (!(lengthMm > 0))
      simpleError(
        "lengthMm",
        "Trace length must be positive.",
        "invalid_dimensions",
      );
    if (!(widthMm > 0))
      simpleError(
        "widthMm",
        "Trace width must be positive.",
        "invalid_dimensions",
      );
    if (!(thicknessUm > 0))
      simpleError(
        "thicknessUm",
        "Copper thickness must be positive.",
        "invalid_dimensions",
      );
    const lengthM = lengthMm * 1e-3;
    const widthM = widthMm * 1e-3;
    const thicknessM = thicknessUm * 1e-6;
    return {
      traceResistanceMilliohms:
        ((RHO_CU_OHM_M * lengthM) / (widthM * thicknessM)) * 1000,
    };
  },
  description:
    "Compute PCB trace resistance in milliohms from copper resistivity 1.7e-8 ohm m and trace dimensions.",
  id: "electronics/pcb-trace-resistance",
  inputs: [
    { id: "lengthMm", kind: "number", label: "Trace length", unit: "mm" },
    { id: "widthMm", kind: "number", label: "Trace width", unit: "mm" },
    {
      id: "thicknessUm",
      kind: "number",
      label: "Copper thickness",
      unit: "um",
    },
  ],
  outputs: [
    {
      id: "traceResistanceMilliohms",
      kind: "number",
      label: "Trace resistance",
      unit: "mOhm",
    },
  ],
  title: "PCB Trace Resistance",
});
export const runPcbTraceResistance = pcbTraceResistanceTool.execute;
export default pcbTraceResistanceTool;
