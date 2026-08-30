import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LedForwardVoltageVsCurrentInput = Readonly<{
  readonly forwardAmperes: number;
  readonly saturationAmperes: number;
  readonly idealityFactor: number;
  readonly temperatureKelvin: number;
}>;
export type LedForwardVoltageVsCurrentOutput = Readonly<{
  readonly forwardVolts: number;
}>;

export const calculateLedForwardVoltageVsCurrent = (
  x: LedForwardVoltageVsCurrentInput,
): LedForwardVoltageVsCurrentOutput => {
  if (!Number.isFinite(x.forwardAmperes) || x.forwardAmperes < 0)
    simpleError("forwardAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.saturationAmperes) || x.saturationAmperes < 0)
    simpleError("saturationAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.idealityFactor) || x.idealityFactor < 0)
    simpleError("idealityFactor", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.temperatureKelvin) || x.temperatureKelvin < 0)
    simpleError("temperatureKelvin", "Provide a finite number at least 0.");
  const forwardVolts =
    ((x.idealityFactor * 1.380649e-23 * x.temperatureKelvin) /
      1.602176634e-19) *
    Math.log1p(x.forwardAmperes / x.saturationAmperes);
  if (!Number.isFinite(forwardVolts))
    simpleError(
      "forwardVolts",
      "Inputs produce an undefined or non-finite result.",
    );
  return { forwardVolts: Object.is(forwardVolts, -0) ? 0 : forwardVolts };
};

export const example = {
  input: {
    forwardAmperes: 0.01,
    saturationAmperes: 1e-15,
    idealityFactor: 2,
    temperatureKelvin: 300,
  },
  output: { forwardVolts: 1.5476871626406297 },
} satisfies ToolExample<
  LedForwardVoltageVsCurrentInput,
  LedForwardVoltageVsCurrentOutput
>;

export const tool = createSimpleTool({
  id: "electronics/led-forward-voltage-vs-current",
  title: "LED Forward Voltage Vs Current",
  description:
    "Shockley-diode forward voltage estimate from current, saturation current, ideality factor and junction temperature; series resistance omitted.",
  inputs: [
    {
      id: "forwardAmperes",
      kind: "number",
      label: "Forward Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "saturationAmperes",
      kind: "number",
      label: "Saturation Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "idealityFactor",
      kind: "number",
      label: "Ideality Factor",
      minimum: 0,
    },
    {
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature Kelvin",
      unit: "K",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "forwardVolts", kind: "number", label: "Forward Volts", unit: "V" },
  ],
  calculate: (input) =>
    calculateLedForwardVoltageVsCurrent({
      forwardAmperes: input.forwardAmperes as number,
      saturationAmperes: input.saturationAmperes as number,
      idealityFactor: input.idealityFactor as number,
      temperatureKelvin: input.temperatureKelvin as number,
    }),
});
export const ledForwardVoltageVsCurrentTool = tool;
export const runLedForwardVoltageVsCurrent = tool.execute;
export default tool;
