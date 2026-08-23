import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PressureAltitudeCorrectedTempInput = {
  readonly oatC: number;
  readonly pressureAltitudeFt: number;
};

export type PressureAltitudeCorrectedTempOutput = {
  readonly isaDeviationC: number;
};

export const pressureAltitudeCorrectedTempExample = {
  input: { oatC: 10, pressureAltitudeFt: 5000 },
} satisfies ToolExample<PressureAltitudeCorrectedTempInput>;

export const pressureAltitudeCorrectedTempTool = createSimpleTool({
  id: "aviation/pressure-altitude-corrected-temp",
  title: "ISA Deviation Calculator",
  description:
    "Compare the outside air temperature with the ISA standard temperature at a pressure altitude.",
  inputs: [
    {
      id: "oatC",
      label: "Outside air temperature",
      kind: "number",
      maximum: 60,
      minimum: -80,
      unit: "°C",
    },
    {
      id: "pressureAltitudeFt",
      label: "Pressure altitude",
      kind: "number",
      maximum: 20000,
      minimum: -1000,
      unit: "ft",
    },
  ],
  outputs: [
    {
      id: "isaDeviationC",
      label: "ISA deviation",
      kind: "number",
      unit: "°C",
    },
  ],
  calculate: (input) => {
    const pressureAltitudeFt = input.pressureAltitudeFt as number;
    const isaTempC = 15 - 0.0019812 * pressureAltitudeFt;
    return { isaDeviationC: (input.oatC as number) - isaTempC };
  },
});
export const runPressureAltitudeCorrectedTemp =
  pressureAltitudeCorrectedTempTool.execute;
export default pressureAltitudeCorrectedTempTool;
