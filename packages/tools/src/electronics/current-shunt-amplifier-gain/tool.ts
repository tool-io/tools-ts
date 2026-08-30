import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentShuntAmplifierGainInput = Readonly<{
  readonly outputVolts: number;
  readonly currentAmperes: number;
  readonly shuntOhms: number;
}>;
export type CurrentShuntAmplifierGainOutput = Readonly<{
  readonly voltageGain: number;
}>;

export const calculateCurrentShuntAmplifierGain = (
  x: CurrentShuntAmplifierGainInput,
): CurrentShuntAmplifierGainOutput => {
  if (!Number.isFinite(x.outputVolts))
    simpleError("outputVolts", "Provide a finite number.");
  if (!Number.isFinite(x.currentAmperes))
    simpleError("currentAmperes", "Provide a finite number.");
  if (!Number.isFinite(x.shuntOhms) || x.shuntOhms < 0)
    simpleError("shuntOhms", "Provide a finite number at least 0.");
  const voltageGain = x.outputVolts / (x.currentAmperes * x.shuntOhms);
  if (!Number.isFinite(voltageGain))
    simpleError(
      "voltageGain",
      "Inputs produce an undefined or non-finite result.",
    );
  return { voltageGain: Object.is(voltageGain, -0) ? 0 : voltageGain };
};

export const example = {
  input: { outputVolts: 1, currentAmperes: 2, shuntOhms: 0.01 },
  output: { voltageGain: 50 },
} satisfies ToolExample<
  CurrentShuntAmplifierGainInput,
  CurrentShuntAmplifierGainOutput
>;

export const tool = createSimpleTool({
  id: "electronics/current-shunt-amplifier-gain",
  title: "Current Shunt Amplifier Gain",
  description:
    "Voltage gain of a current-shunt amplifier from output swing and measured shunt input swing.",
  inputs: [
    { id: "outputVolts", kind: "number", label: "Output Volts", unit: "V" },
    {
      id: "currentAmperes",
      kind: "number",
      label: "Current Amperes",
      unit: "A",
    },
    {
      id: "shuntOhms",
      kind: "number",
      label: "Shunt Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [{ id: "voltageGain", kind: "number", label: "Voltage Gain" }],
  calculate: (input) =>
    calculateCurrentShuntAmplifierGain({
      outputVolts: input.outputVolts as number,
      currentAmperes: input.currentAmperes as number,
      shuntOhms: input.shuntOhms as number,
    }),
});
export const currentShuntAmplifierGainTool = tool;
export const runCurrentShuntAmplifierGain = tool.execute;
export default tool;
