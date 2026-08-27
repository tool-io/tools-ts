import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const apparentPowerExample = {
  input: { ampsRms: 0.5, voltsRms: 120 },
} satisfies ToolExample<{
  readonly ampsRms: number;
  readonly voltsRms: number;
}>;

export const apparentPowerTool = createSimpleTool({
  id: "electronics/apparent-power",
  title: "Apparent Power VA",
  description:
    "Calculate apparent power in volt-amperes from RMS voltage and RMS current.",
  inputs: [
    {
      id: "voltsRms",
      label: "RMS voltage",
      kind: "number",
      minimum: 0,
      unit: "V",
    },
    {
      id: "ampsRms",
      label: "RMS current",
      kind: "number",
      minimum: 0,
      unit: "A",
    },
  ],
  outputs: [
    {
      id: "apparentPowerVa",
      label: "Apparent power",
      kind: "number",
      unit: "VA",
    },
  ],
  calculate: (input) => ({
    apparentPowerVa: (input.voltsRms as number) * (input.ampsRms as number),
  }),
});
export const runApparentPower = apparentPowerTool.execute;
export default apparentPowerTool;
