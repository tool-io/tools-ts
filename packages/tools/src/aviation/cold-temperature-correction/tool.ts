import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ColdTemperatureCorrectionInput = {
  readonly indicatedAltitudeFt: number;
  readonly oatC: number;
};

export type ColdTemperatureCorrectionOutput = {
  readonly temperatureCorrectionFt: number;
};

const ISA_LAPSE_RATE_K_PER_FT = 0.0019812;
const CORRECTION_FACTOR_FT_PER_KELVIN = 118.8;

export const coldTemperatureCorrectionExample = {
  input: { indicatedAltitudeFt: 5000, oatC: -20 },
  output: { temperatureCorrectionFt: -2981.1672 },
} satisfies ToolExample<
  ColdTemperatureCorrectionInput,
  ColdTemperatureCorrectionOutput
>;

export const calculateColdTemperatureCorrection = (
  input: ColdTemperatureCorrectionInput,
): ColdTemperatureCorrectionOutput => ({
  temperatureCorrectionFt:
    CORRECTION_FACTOR_FT_PER_KELVIN *
    (input.oatC - (15 - ISA_LAPSE_RATE_K_PER_FT * input.indicatedAltitudeFt)),
});

export const coldTemperatureCorrectionTool = createSimpleTool({
  calculate: (input) =>
    calculateColdTemperatureCorrection(
      input as unknown as ColdTemperatureCorrectionInput,
    ),
  description:
    "Estimate the altitude correction for cold temperatures against the ISA atmosphere.",
  id: "aviation/cold-temperature-correction",
  inputs: [
    {
      description: "Indicated altitude where the correction applies.",
      id: "indicatedAltitudeFt",
      kind: "number",
      label: "Indicated altitude",
      minimum: 0,
      unit: "ft",
    },
    {
      description: "Outside air temperature in degrees Celsius.",
      id: "oatC",
      kind: "number",
      label: "OAT",
      maximum: 60,
      minimum: -80,
      unit: "°C",
    },
  ],
  outputs: [
    {
      description:
        "Altitude to add for true altitude; negative when colder than ISA.",
      format: "length-ft",
      id: "temperatureCorrectionFt",
      kind: "number",
      label: "Temperature correction",
      unit: "ft",
    },
  ],
  title: "Cold Temperature Correction Calculator",
});
export const runColdTemperatureCorrection =
  coldTemperatureCorrectionTool.execute;
export default coldTemperatureCorrectionTool;
