import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type OxygenContentBloodInput = {
  readonly hemoglobinGDl: number;
  readonly saturationFraction: number;
  readonly pao2Mmhg: number;
};

export type OxygenContentBloodOutput = {
  readonly oxygenContentMlPerDL: number;
};

export const oxygenContentBloodExample = {
  input: { hemoglobinGDl: 15, saturationFraction: 0.98, pao2Mmhg: 100 },
  output: { oxygenContentMlPerDL: 19.998 },
} satisfies ToolExample<OxygenContentBloodInput, OxygenContentBloodOutput>;

export const oxygenContentBloodTool = createSimpleTool({
  id: "biology/oxygen-content-blood",
  title: "O2 Content Blood",
  description:
    "Compute arterial oxygen content from hemoglobin, saturation, and PaO2.",
  inputs: [
    {
      id: "hemoglobinGDl",
      kind: "number",
      label: "Hemoglobin",
      minimum: Number.MIN_VALUE,
      unit: "g/dL",
    },
    {
      id: "saturationFraction",
      kind: "number",
      label: "Saturation fraction",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "pao2Mmhg",
      kind: "number",
      label: "PaO2",
      minimum: 0,
      unit: "mmHg",
    },
  ],
  outputs: [
    {
      id: "oxygenContentMlPerDL",
      kind: "number",
      label: "Oxygen content",
      unit: "mL/dL",
    },
  ],
  calculate: (input) => ({
    oxygenContentMlPerDL:
      1.34 *
        (input.hemoglobinGDl as number) *
        (input.saturationFraction as number) +
      0.003 * (input.pao2Mmhg as number),
  }),
});
export const runOxygenContentBlood = oxygenContentBloodTool.execute;
export default oxygenContentBloodTool;
