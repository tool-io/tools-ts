import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const STANDARD_PRESSURE_PA = 101325;
const STANDARD_TEMPERATURE_K = 288.15;

export type MaterialBalanceGasInitiallyInPlaceInput = {
  readonly pressureMPa: number;
  readonly temperatureKelvin: number;
  readonly zFactor: number;
  readonly areaSquareKilometers: number;
  readonly netThicknessM: number;
  readonly porosity: number;
  readonly waterSaturation: number;
};

export type MaterialBalanceGasInitiallyInPlaceOutput = {
  readonly gasFormationVolumeFactorM3PerSm3: number;
  readonly gasInitiallyInPlaceSm3: number;
};

export const calculateMaterialBalanceGasInitiallyInPlace = (
  input: MaterialBalanceGasInitiallyInPlaceInput,
): MaterialBalanceGasInitiallyInPlaceOutput => {
  if (!(input.pressureMPa > 0))
    simpleError(
      "pressureMPa",
      "Reservoir pressure must be positive.",
      "invalid_pressure",
    );
  if (!(input.temperatureKelvin > 0))
    simpleError(
      "temperatureKelvin",
      "Reservoir temperature must be positive.",
      "invalid_temperature",
    );
  if (!(input.zFactor > 0))
    simpleError("zFactor", "Z factor must be positive.", "invalid_z_factor");
  if (!(input.areaSquareKilometers > 0))
    simpleError(
      "areaSquareKilometers",
      "Drainage area must be positive.",
      "invalid_area",
    );
  if (!(input.netThicknessM > 0))
    simpleError(
      "netThicknessM",
      "Net thickness must be positive.",
      "invalid_thickness",
    );
  if (!(input.porosity > 0 && input.porosity <= 1))
    simpleError(
      "porosity",
      "Porosity must lie between zero and one.",
      "invalid_porosity",
    );
  if (!(input.waterSaturation >= 0 && input.waterSaturation < 1))
    simpleError(
      "waterSaturation",
      "Water saturation must lie in the interval zero to one.",
      "invalid_saturation",
    );
  const gasFormationVolumeFactorM3PerSm3 =
    (STANDARD_PRESSURE_PA / (input.pressureMPa * 1e6)) *
    (input.temperatureKelvin / STANDARD_TEMPERATURE_K) *
    input.zFactor;
  const poreVolumeM3 =
    input.areaSquareKilometers *
    1e6 *
    input.netThicknessM *
    input.porosity *
    (1 - input.waterSaturation);
  return {
    gasFormationVolumeFactorM3PerSm3,
    gasInitiallyInPlaceSm3: poreVolumeM3 / gasFormationVolumeFactorM3PerSm3,
  };
};

export const materialBalanceGasInitiallyInPlaceExample = {
  input: {
    pressureMPa: 20,
    temperatureKelvin: 350,
    zFactor: 0.9,
    areaSquareKilometers: 5,
    netThicknessM: 10,
    porosity: 0.18,
    waterSaturation: 0.25,
  },
  output: {
    gasFormationVolumeFactorM3PerSm3: 0.005538326392503904,
    gasInitiallyInPlaceSm3: 1218779739.8752248,
  },
} satisfies ToolExample<
  MaterialBalanceGasInitiallyInPlaceInput,
  MaterialBalanceGasInitiallyInPlaceOutput
>;

export const materialBalanceGasInitiallyInPlaceTool = createSimpleTool({
  id: "geology/material-balance-gas-initially-in-place",
  title: "Material Balance Gas Initially In Place Calculator",
  description:
    "Estimate the volumetric gas initially in place from pore volume and the real-gas formation volume factor Bg at standard conditions of 101325 Pa and 288.15 K.",
  inputs: [
    {
      description: "Reservoir pressure in megapascals.",
      id: "pressureMPa",
      kind: "number",
      label: "Pressure",
    },
    {
      description: "Reservoir temperature in kelvin.",
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature",
    },
    {
      description: "Gas deviation factor z.",
      id: "zFactor",
      kind: "number",
      label: "z",
    },
    {
      description: "Drainage area in square kilometres.",
      id: "areaSquareKilometers",
      kind: "number",
      label: "Area",
    },
    {
      description: "Net thickness in metres.",
      id: "netThicknessM",
      kind: "number",
      label: "Net thickness",
    },
    {
      description: "Porosity as a volume fraction.",
      id: "porosity",
      kind: "number",
      label: "Porosity",
      maximum: 1,
    },
    {
      description: "Initial water saturation as a fraction.",
      id: "waterSaturation",
      kind: "number",
      label: "Sw",
    },
  ],
  outputs: [
    {
      description:
        "Gas formation volume factor Bg in reservoir cubic metres per standard cubic metre.",
      id: "gasFormationVolumeFactorM3PerSm3",
      kind: "number",
      label: "Bg",
    },
    {
      description:
        "Gas initially in place at standard conditions in standard cubic metres.",
      id: "gasInitiallyInPlaceSm3",
      kind: "number",
      label: "GIIP",
    },
  ],
  calculate: (input) =>
    calculateMaterialBalanceGasInitiallyInPlace(
      input as unknown as MaterialBalanceGasInitiallyInPlaceInput,
    ),
});

export const runMaterialBalanceGasInitiallyInPlace =
  materialBalanceGasInitiallyInPlaceTool.execute;
export default materialBalanceGasInitiallyInPlaceTool;
