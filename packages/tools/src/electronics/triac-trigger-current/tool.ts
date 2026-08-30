import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TriacTriggerCurrentInput = Readonly<{
  readonly driveVoltageV: number;
  readonly gateDropV: number;
  readonly seriesResistanceOhm: number;
}>;
export type TriacTriggerCurrentOutput = Readonly<{
  readonly gateCurrentA: number;
}>;

export const calculateTriacTriggerCurrent = (
  x: TriacTriggerCurrentInput,
): TriacTriggerCurrentOutput => {
  if (!Number.isFinite(x.driveVoltageV) || x.driveVoltageV < 0)
    simpleError("driveVoltageV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.gateDropV) || x.gateDropV < 0)
    simpleError("gateDropV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.seriesResistanceOhm) || x.seriesResistanceOhm < 0)
    simpleError("seriesResistanceOhm", "Provide a finite number at least 0.");
  if (!(x.driveVoltageV >= x.gateDropV && x.seriesResistanceOhm > 0))
    simpleError(
      "input",
      "Drive must exceed gate drop and resistance must be positive.",
    );
  const gateCurrentA = (x.driveVoltageV - x.gateDropV) / x.seriesResistanceOhm;
  if (!Number.isFinite(gateCurrentA))
    simpleError("gateCurrentA", "The inputs produce an invalid result.");
  return { gateCurrentA: Object.is(gateCurrentA, -0) ? 0 : gateCurrentA };
};

export const example = {
  input: { driveVoltageV: 5, gateDropV: 1, seriesResistanceOhm: 100 },
  output: { gateCurrentA: 0.04 },
} satisfies ToolExample<TriacTriggerCurrentInput, TriacTriggerCurrentOutput>;

export const tool = createSimpleTool({
  id: "electronics/triac-trigger-current",
  title: "TRIAC Trigger Current",
  description:
    "Estimate TRIAC gate current from drive voltage, gate drop, and total series resistance; this does not predict the device's specified trigger threshold.",
  inputs: [
    {
      id: "driveVoltageV",
      kind: "number",
      label: "Gate drive voltage",
      unit: "V",
      minimum: 0,
    },
    {
      id: "gateDropV",
      kind: "number",
      label: "Gate voltage drop",
      unit: "V",
      minimum: 0,
    },
    {
      id: "seriesResistanceOhm",
      kind: "number",
      label: "Gate series resistance",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "gateCurrentA", kind: "number", label: "Gate current", unit: "A" },
  ],
  calculate: (input) =>
    calculateTriacTriggerCurrent({
      driveVoltageV: input.driveVoltageV as number,
      gateDropV: input.gateDropV as number,
      seriesResistanceOhm: input.seriesResistanceOhm as number,
    }),
});
export const triacTriggerCurrentTool = tool;
export const runTriacTriggerCurrent = tool.execute;
export default tool;
