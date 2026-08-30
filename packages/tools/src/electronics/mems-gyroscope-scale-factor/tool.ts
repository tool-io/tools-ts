import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MemsGyroscopeScaleFactorInput = Readonly<{
  readonly signalChangeVolts: number;
  readonly rateChangeDegreesPerSecond: number;
}>;
export type MemsGyroscopeScaleFactorOutput = Readonly<{
  readonly voltsPerDegreePerSecond: number;
}>;

export const calculateMemsGyroscopeScaleFactor = (
  x: MemsGyroscopeScaleFactorInput,
): MemsGyroscopeScaleFactorOutput => {
  if (!Number.isFinite(x.signalChangeVolts))
    simpleError("signalChangeVolts", "Provide a finite number.");
  if (!Number.isFinite(x.rateChangeDegreesPerSecond))
    simpleError("rateChangeDegreesPerSecond", "Provide a finite number.");
  const voltsPerDegreePerSecond =
    x.signalChangeVolts / x.rateChangeDegreesPerSecond;
  if (!Number.isFinite(voltsPerDegreePerSecond))
    simpleError(
      "voltsPerDegreePerSecond",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    voltsPerDegreePerSecond: Object.is(voltsPerDegreePerSecond, -0)
      ? 0
      : voltsPerDegreePerSecond,
  };
};

export const example = {
  input: { signalChangeVolts: 2, rateChangeDegreesPerSecond: 100 },
  output: { voltsPerDegreePerSecond: 0.02 },
} satisfies ToolExample<
  MemsGyroscopeScaleFactorInput,
  MemsGyroscopeScaleFactorOutput
>;

export const tool = createSimpleTool({
  id: "electronics/mems-gyroscope-scale-factor",
  title: "MEMS Gyroscope Scale Factor",
  description:
    "Gyroscope output scale factor from change in indicated signal divided by change in applied angular rate.",
  inputs: [
    {
      id: "signalChangeVolts",
      kind: "number",
      label: "Signal Change Volts",
      unit: "V",
    },
    {
      id: "rateChangeDegreesPerSecond",
      kind: "number",
      label: "Rate Change Degrees Per Second",
      unit: "°/s",
    },
  ],
  outputs: [
    {
      id: "voltsPerDegreePerSecond",
      kind: "number",
      label: "Volts Per Degree Per Second",
      unit: "V/(°/s)",
    },
  ],
  calculate: (input) =>
    calculateMemsGyroscopeScaleFactor({
      signalChangeVolts: input.signalChangeVolts as number,
      rateChangeDegreesPerSecond: input.rateChangeDegreesPerSecond as number,
    }),
});
export const memsGyroscopeScaleFactorTool = tool;
export const runMemsGyroscopeScaleFactor = tool.execute;
export default tool;
