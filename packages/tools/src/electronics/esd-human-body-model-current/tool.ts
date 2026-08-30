import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EsdHumanBodyModelCurrentInput = Readonly<{
  readonly chargeVoltageV: number;
}>;
export type EsdHumanBodyModelCurrentOutput = Readonly<{
  readonly idealPeakCurrentA: number;
}>;

export const calculateEsdHumanBodyModelCurrent = (
  x: EsdHumanBodyModelCurrentInput,
): EsdHumanBodyModelCurrentOutput => {
  if (!Number.isFinite(x.chargeVoltageV) || x.chargeVoltageV < 0)
    simpleError("chargeVoltageV", "Provide a finite number at least 0.");
  const idealPeakCurrentA = x.chargeVoltageV / 1500;
  if (!Number.isFinite(idealPeakCurrentA))
    simpleError("idealPeakCurrentA", "The inputs produce an invalid result.");
  return {
    idealPeakCurrentA: Object.is(idealPeakCurrentA, -0) ? 0 : idealPeakCurrentA,
  };
};

export const example = {
  input: { chargeVoltageV: 1000 },
  output: { idealPeakCurrentA: 0.6666666666666666 },
} satisfies ToolExample<
  EsdHumanBodyModelCurrentInput,
  EsdHumanBodyModelCurrentOutput
>;

export const tool = createSimpleTool({
  id: "electronics/esd-human-body-model-current",
  title: "ESD Human Body Model Current",
  description:
    "Estimate idealized HBM short-circuit peak current from charging voltage and the 1500-ohm series resistor; not a substitute for a JS-001 waveform test.",
  inputs: [
    {
      id: "chargeVoltageV",
      kind: "number",
      label: "HBM charge voltage",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "idealPeakCurrentA",
      kind: "number",
      label: "Idealized peak current",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateEsdHumanBodyModelCurrent({
      chargeVoltageV: input.chargeVoltageV as number,
    }),
});
export const esdHumanBodyModelCurrentTool = tool;
export const runEsdHumanBodyModelCurrent = tool.execute;
export default tool;
