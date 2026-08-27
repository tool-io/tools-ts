import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GasFormationVolumeFactorInput = {
  readonly pressurePa: number;
  readonly temperatureK: number;
  readonly zFactor?: number;
};

export type GasFormationVolumeFactorOutput = {
  readonly gasFormationVolumeFactorM3PerStdM3: number;
};

const STANDARD_PRESSURE_PA = 101325;
const STANDARD_TEMPERATURE_K = 288.15;

export const calculateGasFormationVolumeFactor = (
  input: GasFormationVolumeFactorInput,
): GasFormationVolumeFactorOutput => {
  const z = input.zFactor ?? 1;
  if (!(input.pressurePa > 0))
    simpleError(
      "pressurePa",
      "Pressure must be greater than zero.",
      "invalid_pressure",
    );
  if (!(input.temperatureK > 0))
    simpleError(
      "temperatureK",
      "Temperature must be greater than zero.",
      "invalid_temperature",
    );
  if (!(z > 0))
    simpleError(
      "zFactor",
      "Gas compressibility factor must be greater than zero.",
      "invalid_z_factor",
    );
  return {
    gasFormationVolumeFactorM3PerStdM3:
      (z *
        (input.temperatureK / STANDARD_TEMPERATURE_K) *
        STANDARD_PRESSURE_PA) /
      input.pressurePa,
  };
};

export const gasFormationVolumeFactorExample = {
  input: { pressurePa: 20_000_000, temperatureK: 350, zFactor: 0.9 },
  output: { gasFormationVolumeFactorM3PerStdM3: 0.005538326392503904 },
} satisfies ToolExample<
  GasFormationVolumeFactorInput,
  GasFormationVolumeFactorOutput
>;

export const gasFormationVolumeFactorTool = createSimpleTool({
  id: "geology/gas-formation-volume-factor",
  title: "Gas Formation Volume Factor Calculator",
  description:
    "Compute the gas formation volume factor Bg relating reservoir cubic metres to standard cubic metres at 101.325 kPa and 288.15 K.",
  inputs: [
    {
      description: "Reservoir pressure.",
      id: "pressurePa",
      kind: "number",
      label: "Pressure",
      minimum: 0,
      unit: "Pa",
    },
    {
      description: "Reservoir temperature.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: 0,
      unit: "K",
    },
    {
      default: 1,
      description: "Gas compressibility factor at reservoir conditions.",
      id: "zFactor",
      kind: "number",
      label: "Z factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Gas formation volume factor in reservoir m³ per standard m³.",
      id: "gasFormationVolumeFactorM3PerStdM3",
      kind: "number",
      label: "Bg",
    },
  ],
  calculate: (input) =>
    calculateGasFormationVolumeFactor(
      input as unknown as GasFormationVolumeFactorInput,
    ),
});

export const runGasFormationVolumeFactor = gasFormationVolumeFactorTool.execute;
export default gasFormationVolumeFactorTool;
