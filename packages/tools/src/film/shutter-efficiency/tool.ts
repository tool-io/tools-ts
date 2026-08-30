import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShutterEfficiencyInput = Readonly<{
  readonly actualOpenSeconds: number;
  readonly commandedSeconds: number;
}>;
export type ShutterEfficiencyOutput = Readonly<{
  readonly efficiencyPercent: number;
}>;

export const calculateShutterEfficiency = (
  x: ShutterEfficiencyInput,
): ShutterEfficiencyOutput => {
  if (!Number.isFinite(x.actualOpenSeconds) || x.actualOpenSeconds < 0)
    simpleError("actualOpenSeconds", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.commandedSeconds) || x.commandedSeconds < 0)
    simpleError("commandedSeconds", "Provide a finite number at least 0.");
  const efficiencyPercent = (100 * x.actualOpenSeconds) / x.commandedSeconds;
  if (!Number.isFinite(efficiencyPercent))
    simpleError(
      "efficiencyPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    efficiencyPercent: Object.is(efficiencyPercent, -0) ? 0 : efficiencyPercent,
  };
};

export const example = {
  input: { actualOpenSeconds: 0.009, commandedSeconds: 0.01 },
  output: { efficiencyPercent: 89.99999999999999 },
} satisfies ToolExample<ShutterEfficiencyInput, ShutterEfficiencyOutput>;

export const tool = createSimpleTool({
  id: "film/shutter-efficiency",
  title: "Shutter Efficiency",
  description:
    "Measured shutter efficiency percentage from actual open time divided by commanded exposure time.",
  inputs: [
    {
      id: "actualOpenSeconds",
      kind: "number",
      label: "Actual Open Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "commandedSeconds",
      kind: "number",
      label: "Commanded Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateShutterEfficiency({
      actualOpenSeconds: input.actualOpenSeconds as number,
      commandedSeconds: input.commandedSeconds as number,
    }),
});
export const shutterEfficiencyTool = tool;
export const runShutterEfficiency = tool.execute;
export default tool;
