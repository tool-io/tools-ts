import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const dacDnlExample = {
  input: { actualStepVolts: 0.0011, idealStepVolts: 0.001 },
} satisfies ToolExample<{
  readonly actualStepVolts: number;
  readonly idealStepVolts: number;
}>;

export const dacDnlTool = createSimpleTool({
  id: "electronics/dac-dnl",
  title: "DAC DNL LSB",
  description:
    "Express differential nonlinearity in least-significant-bit units as dnlLsb = (actualStepVolts - idealStepVolts) / idealStepVolts.",
  inputs: [
    {
      description: "Measured output step between adjacent codes.",
      id: "actualStepVolts",
      kind: "number",
      label: "Actual Step",
      unit: "V",
    },
    {
      description: "Ideal output step between adjacent codes.",
      id: "idealStepVolts",
      kind: "number",
      label: "Ideal Step",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Signed differential nonlinearity in LSB units.",
      id: "dnlLsb",
      kind: "number",
      label: "DNL",
      unit: "LSB",
    },
  ],
  calculate: (input) => {
    const actualStepVolts = input.actualStepVolts as number;
    const idealStepVolts = input.idealStepVolts as number;
    if (!(idealStepVolts > 0))
      simpleError("idealStepVolts", "Ideal step must be positive.");
    if (!(actualStepVolts >= 0))
      simpleError("actualStepVolts", "Actual step must not be negative.");
    return { dnlLsb: (actualStepVolts - idealStepVolts) / idealStepVolts };
  },
});
export const runDacDnl = dacDnlTool.execute;
export default dacDnlTool;
