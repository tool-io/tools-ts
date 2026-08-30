import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermalTimeConstantInput = Readonly<{
  readonly thermalKelvinPerWatt: number;
  readonly heatJoulesPerKelvin: number;
}>;
export type ThermalTimeConstantOutput = Readonly<{
  readonly timeConstantSeconds: number;
}>;

export const calculateThermalTimeConstant = (
  x: ThermalTimeConstantInput,
): ThermalTimeConstantOutput => {
  if (!Number.isFinite(x.thermalKelvinPerWatt) || x.thermalKelvinPerWatt < 0)
    simpleError("thermalKelvinPerWatt", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.heatJoulesPerKelvin) || x.heatJoulesPerKelvin < 0)
    simpleError("heatJoulesPerKelvin", "Provide a finite number at least 0.");
  const timeConstantSeconds = x.thermalKelvinPerWatt * x.heatJoulesPerKelvin;
  if (!Number.isFinite(timeConstantSeconds))
    simpleError(
      "timeConstantSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    timeConstantSeconds: Object.is(timeConstantSeconds, -0)
      ? 0
      : timeConstantSeconds,
  };
};

export const example = {
  input: { thermalKelvinPerWatt: 2, heatJoulesPerKelvin: 100 },
  output: { timeConstantSeconds: 200 },
} satisfies ToolExample<ThermalTimeConstantInput, ThermalTimeConstantOutput>;

export const tool = createSimpleTool({
  id: "engineering/thermal-time-constant",
  title: "Thermal Time Constant",
  description:
    "Lumped thermal first-order time constant from thermal resistance and heat capacity, τ=Rth Cth.",
  inputs: [
    {
      id: "thermalKelvinPerWatt",
      kind: "number",
      label: "Thermal Kelvin Per Watt",
      unit: "K/W",
      minimum: 0,
    },
    {
      id: "heatJoulesPerKelvin",
      kind: "number",
      label: "Heat Joules Per Kelvin",
      unit: "J/K",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "timeConstantSeconds",
      kind: "number",
      label: "Time Constant Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateThermalTimeConstant({
      thermalKelvinPerWatt: input.thermalKelvinPerWatt as number,
      heatJoulesPerKelvin: input.heatJoulesPerKelvin as number,
    }),
});
export const thermalTimeConstantTool = tool;
export const runThermalTimeConstant = tool.execute;
export default tool;
