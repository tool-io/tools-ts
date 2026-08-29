import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { differentialRmsVoltageV: 0.35, terminationResistanceOhm: 100 },
  output: { terminationPowerW: 0.0012249999999999997 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/lvds-termination-power",
  title: "LVDS Termination Power",
  description:
    "Calculate differential termination resistor dissipation as Vdiff,RMS²/R. Use the RMS voltage across the resistor, not transmitter supply voltage.",
  inputs: [
    {
      id: "differentialRmsVoltageV",
      kind: "number",
      label: "Differential RMS voltage (V)",
      minimum: 0,
    },
    {
      id: "terminationResistanceOhm",
      kind: "number",
      label: "Termination resistance (Ω)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "terminationPowerW", kind: "number", label: "Termination Power W" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      terminationPowerW:
        (i.differentialRmsVoltageV * i.differentialRmsVoltageV) /
        i.terminationResistanceOhm,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type LvdsTerminationPowerInput = Readonly<typeof example.input>;
export type LvdsTerminationPowerOutput = Readonly<typeof example.output>;
export const lvdsTerminationPowerTool = tool;
export const runLvdsTerminationPower = tool.execute;
export default tool;
