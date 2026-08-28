import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const paOutputPowerDbmExample = {
  input: { gainDb: 25, inDbm: 10, lossesDb: 3 },
} satisfies ToolExample<{
  readonly gainDb: number;
  readonly inDbm: number;
  readonly lossesDb: number;
}>;

export const paOutputPowerDbmTool = createSimpleTool({
  id: "electronics/pa-output-power-dbm",
  title: "PA Output dBm",
  description:
    "Estimate power amplifier output level as outDbm = inDbm + gainDb - lossesDb.",
  inputs: [
    {
      description: "Input power level.",
      id: "inDbm",
      kind: "number",
      label: "Input Power",
      unit: "dBm",
    },
    {
      description: "Amplifier gain.",
      id: "gainDb",
      kind: "number",
      label: "Gain",
      unit: "dB",
    },
    {
      description: "Combined interstage and output losses.",
      id: "lossesDb",
      kind: "number",
      label: "Losses",
      unit: "dB",
    },
  ],
  outputs: [
    {
      description: "Output power level at the antenna port.",
      id: "paOutputDbm",
      kind: "number",
      label: "Output Power",
      unit: "dBm",
    },
  ],
  calculate: (input) => ({
    paOutputDbm:
      (input.inDbm as number) +
      (input.gainDb as number) -
      (input.lossesDb as number),
  }),
});
export const runPaOutputPowerDbm = paOutputPowerDbmTool.execute;
export default paOutputPowerDbmTool;
