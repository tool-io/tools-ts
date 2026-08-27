import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InputOffsetVoltageDriftInput = {
  readonly offsetChangeUv: number;
  readonly temperatureDeltaC: number;
};

export type InputOffsetVoltageDriftOutput = {
  readonly driftUvPerC: number;
};

export const inputOffsetVoltageDriftExample = {
  input: { offsetChangeUv: 50, temperatureDeltaC: 25 },
  output: { driftUvPerC: 2 },
} satisfies ToolExample<
  InputOffsetVoltageDriftInput,
  InputOffsetVoltageDriftOutput
>;

export const inputOffsetVoltageDriftTool = createSimpleTool({
  id: "electronics/input-offset-voltage-drift",
  title: "Offset Drift",
  description:
    "Compute the signed input offset voltage drift as delta Voffset(uV) / delta T(degC); the temperature interval must not be zero.",
  inputs: [
    {
      id: "offsetChangeUv",
      label: "Offset change",
      kind: "number",
      unit: "µV",
    },
    {
      id: "temperatureDeltaC",
      label: "Temperature change",
      kind: "number",
      unit: "°C",
    },
  ],
  outputs: [
    {
      id: "driftUvPerC",
      label: "Offset drift",
      kind: "number",
      unit: "µV/°C",
    },
  ],
  calculate: (input) => {
    const offsetChangeUv = input.offsetChangeUv as number;
    const temperatureDeltaC = input.temperatureDeltaC as number;
    if (temperatureDeltaC === 0)
      simpleError(
        "temperatureDeltaC",
        "Temperature interval must not be zero.",
        "degenerate_interval",
      );
    return {
      driftUvPerC: offsetChangeUv / temperatureDeltaC,
    };
  },
});
export const runInputOffsetVoltageDrift = inputOffsetVoltageDriftTool.execute;
export default inputOffsetVoltageDriftTool;
