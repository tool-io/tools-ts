import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StrainGaugeBridgeOutputInput = Readonly<{
  readonly excitationVoltageV: number;
  readonly gaugeFactor: number;
  readonly strain: number;
}>;
export type StrainGaugeBridgeOutputOutput = Readonly<{
  bridgeOutputVoltageV: number;
}>;

export const calculateStrainGaugeBridgeOutput = (
  i: StrainGaugeBridgeOutputInput,
): StrainGaugeBridgeOutputOutput => {
  if (2 + i.gaugeFactor * i.strain <= 0)
    simpleError(
      "strain",
      "The changed arm cannot have nonpositive resistance.",
    );
  const value =
    (i.excitationVoltageV * (i.gaugeFactor * i.strain)) /
    (2 * (2 + i.gaugeFactor * i.strain));
  if (!Number.isFinite(value))
    simpleError(
      "bridgeOutputVoltageV",
      "The inputs produce a non-finite result.",
    );
  return { bridgeOutputVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { excitationVoltageV: 5, gaugeFactor: 2, strain: 0.001 },
  output: { bridgeOutputVoltageV: 0.002497502497502498 },
} satisfies ToolExample<
  StrainGaugeBridgeOutputInput,
  StrainGaugeBridgeOutputOutput
>;

export const tool = createSimpleTool({
  id: "electronics/strain-gauge-bridge-output",
  title: "Strain Gauge Bridge Output",
  description:
    "Calculate the exact ideal quarter-bridge voltage change for one active strain-gauge arm from excitation voltage, gauge factor, and mechanical strain; bridge polarity follows the changed arm.",
  inputs: [
    {
      id: "excitationVoltageV",
      kind: "number",
      label: "Excitation (V)",
      unit: "V",
    },
    { id: "gaugeFactor", kind: "number", label: "Gauge Factor" },
    { id: "strain", kind: "number", label: "Strain" },
  ],
  outputs: [
    {
      id: "bridgeOutputVoltageV",
      kind: "number",
      label: "Bridge Output (V)",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateStrainGaugeBridgeOutput({
      excitationVoltageV: input.excitationVoltageV as number,
      gaugeFactor: input.gaugeFactor as number,
      strain: input.strain as number,
    }),
});
export const strainGaugeBridgeOutputTool = tool;
export const runStrainGaugeBridgeOutput = tool.execute;
export default tool;
