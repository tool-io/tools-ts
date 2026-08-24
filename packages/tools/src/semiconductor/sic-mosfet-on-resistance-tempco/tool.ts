import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SicMosfetOnResistanceTempcoInput = {
  readonly junctionTemperatureC: number;
  readonly rdsonAt25Ohms: number;
  readonly tempcoPercentPerC: number;
};

export type SicMosfetOnResistanceTempcoOutput = {
  readonly rdsonAtTempOhms: number;
};

export const sicMosfetOnResistanceTempcoExample = {
  input: {
    junctionTemperatureC: 125,
    rdsonAt25Ohms: 0.05,
    tempcoPercentPerC: 0.6,
  },
  output: { rdsonAtTempOhms: 0.08000000000000002 },
} satisfies ToolExample<
  SicMosfetOnResistanceTempcoInput,
  SicMosfetOnResistanceTempcoOutput
>;

export const sicMosfetOnResistanceTempcoTool = createSimpleTool({
  id: "semiconductor/sic-mosfet-on-resistance-tempco",
  title: "SiC MOSFET Rds Tempco Calculator",
  description:
    "Extrapolate SiC MOSFET on-resistance to junction temperature using a linear percent-per-degree temperature coefficient.",
  inputs: [
    {
      description:
        "Datasheet on-resistance at the 25 degree Celsius reference.",
      id: "rdsonAt25Ohms",
      kind: "number",
      label: "Rds(on) at 25 \u00B0C",
      minimum: 0,
      unit: "\u03A9",
    },
    {
      description:
        "Device-specific linear Rds(on) temperature coefficient in percent per degree Celsius.",
      id: "tempcoPercentPerC",
      kind: "number",
      label: "Tempco",
      unit: "%/\u00B0C",
    },
    {
      description: "Junction temperature for the linear extrapolation.",
      id: "junctionTemperatureC",
      kind: "number",
      label: "Junction temperature",
      unit: "\u00B0C",
    },
  ],
  outputs: [
    {
      description:
        "Linearized on-resistance at the requested junction temperature.",
      format: "resistance",
      id: "rdsonAtTempOhms",
      kind: "number",
      label: "Rds(on) at temperature",
      unit: "\u03A9",
    },
  ],
  calculate: (input) => {
    const rdsonAt25Ohms = input.rdsonAt25Ohms as number;
    if (!(rdsonAt25Ohms > 0))
      simpleError(
        "rdsonAt25Ohms",
        "Rds(on) at 25 \u00B0C must be greater than zero.",
      );
    const multiplier =
      1 +
      ((input.tempcoPercentPerC as number) / 100) *
        ((input.junctionTemperatureC as number) - 25);
    if (!(multiplier > 0) || !Number.isFinite(multiplier))
      simpleError(
        "tempcoPercentPerC",
        "The coefficient and temperature must produce a positive resistance.",
        "invalid_temperature_adjustment",
      );
    const rdsonAtTempOhms = rdsonAt25Ohms * multiplier;
    if (!Number.isFinite(rdsonAtTempOhms))
      simpleError(
        "rdsonAt25Ohms",
        "Adjusted resistance is outside the numeric range.",
        "invalid_result",
      );
    return { rdsonAtTempOhms };
  },
});
export const runSicMosfetOnResistanceTempco =
  sicMosfetOnResistanceTempcoTool.execute;
export default sicMosfetOnResistanceTempcoTool;
