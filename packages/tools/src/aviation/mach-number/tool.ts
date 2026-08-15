import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type MachNumberInput = {
  readonly oatC: number;
  readonly trueAirspeedKt: number;
};

export type MachNumberOutput = {
  readonly mach: number;
};

export const machNumberExample = {
  input: { oatC: 15, trueAirspeedKt: 661.478848 },
  output: { mach: 1 },
} satisfies ToolExample<MachNumberInput, MachNumberOutput>;

const ISA_SEA_LEVEL_TEMPERATURE_K = 288.15;
/** Speed of sound at ISA sea level, in knots. */
const ISA_SEA_LEVEL_SPEED_KT = 661.478848;

export const calculateMachNumber = (
  input: MachNumberInput,
): MachNumberOutput => {
  const temperatureK = (input.oatC as number) + 273.15;
  if (temperatureK <= 0)
    simpleError(
      "oatC",
      "Temperature must be above absolute zero.",
      "invalid_temperature",
    );
  const speedOfSound =
    ISA_SEA_LEVEL_SPEED_KT * Math.sqrt(temperatureK / ISA_SEA_LEVEL_TEMPERATURE_K);
  return {
    mach: roundStatistic((input.trueAirspeedKt as number) / speedOfSound),
  };
};

export const machNumberTool = createSimpleTool({
  calculate: (input) =>
    calculateMachNumber(input as unknown as MachNumberInput),
  description: "Compute the Mach number from true airspeed and temperature.",
  id: "aviation/mach-number",
  inputs: [
    {
      description: "True airspeed.",
      id: "trueAirspeedKt",
      kind: "number",
      label: "TAS",
      unit: "kt",
    },
    {
      description: "Outside air temperature.",
      id: "oatC",
      kind: "number",
      label: "OAT",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "True airspeed divided by the local speed of sound.",
      format: "mach",
      id: "mach",
      kind: "number",
      label: "Mach number",
    },
  ],
  title: "Mach Number Calculator",
});
export const runMachNumber = machNumberTool.execute;
export default machNumberTool;
