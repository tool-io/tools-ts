import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const example = {
  input: { layer: "external", temperatureRiseC: 10, crossSectionMil2: 100 },
  output: { currentA: 0.048 * Math.pow(10, 0.44) * Math.pow(100, 0.725) },
} satisfies ToolExample<
  {
    readonly layer: string;
    readonly temperatureRiseC: number;
    readonly crossSectionMil2: number;
  },
  { readonly currentA: number }
>;
export const tool = createSimpleTool({
  id: "electronics/pcb-trace-current-capacity-ipc2221",
  title: "IPC-2221 PCB Trace Current Estimate",
  description:
    "Estimate PCB trace current with the legacy IPC-2221 empirical equation I=k·ΔT^0.44·A^0.725, with A in square mils and k=0.048 external or 0.024 internal. This is a rough thermal estimate; modern IPC-2152 data and board-specific validation are preferable for design sign-off.",
  inputs: [
    {
      id: "layer",
      kind: "string",
      label: "Layer",
      enum: ["external", "internal"],
    },
    {
      id: "temperatureRiseC",
      kind: "number",
      label: "Allowed temperature rise (°C)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "crossSectionMil2",
      kind: "number",
      label: "Copper cross-section (mil²)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "currentA", kind: "number", label: "Estimated current (A)" }],
  calculate: (input) => {
    const k = input.layer === "external" ? 0.048 : 0.024;
    return {
      currentA:
        k *
        Math.pow(input.temperatureRiseC as number, 0.44) *
        Math.pow(input.crossSectionMil2 as number, 0.725),
    };
  },
});
export type PcbTraceCurrentCapacityIpc2221Input = Readonly<
  typeof example.input
>;
export type PcbTraceCurrentCapacityIpc2221Output = Readonly<
  typeof example.output
>;
export const pcbTraceCurrentCapacityIpc2221Tool = tool;
export const runPcbTraceCurrentCapacityIpc2221 = tool.execute;
export default tool;
