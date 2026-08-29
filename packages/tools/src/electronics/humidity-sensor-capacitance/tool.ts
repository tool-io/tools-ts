import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HumiditySensorCapacitanceInput = Readonly<{
  readonly zeroHumidityCapacitancePf: number;
  readonly sensitivityPfPerPercent: number;
  readonly relativeHumidityPercent: number;
}>;
export type HumiditySensorCapacitanceOutput = Readonly<{
  capacitancePf: number;
}>;

export const calculateHumiditySensorCapacitance = (
  i: HumiditySensorCapacitanceInput,
): HumiditySensorCapacitanceOutput => {
  const value =
    i.zeroHumidityCapacitancePf +
    i.sensitivityPfPerPercent * i.relativeHumidityPercent;
  if (!Number.isFinite(value))
    simpleError("capacitancePf", "The inputs produce a non-finite result.");
  return { capacitancePf: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    zeroHumidityCapacitancePf: 100,
    sensitivityPfPerPercent: 0.2,
    relativeHumidityPercent: 50,
  },
  output: { capacitancePf: 110 },
} satisfies ToolExample<
  HumiditySensorCapacitanceInput,
  HumiditySensorCapacitanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/humidity-sensor-capacitance",
  title: "Humidity Sensor Capacitance",
  description:
    "Calculate a linear humidity sensor's capacitance from its calibrated zero-RH capacitance and sensitivity per percentage point of relative humidity.",
  inputs: [
    {
      id: "zeroHumidityCapacitancePf",
      kind: "number",
      label: "Zero Humidity Capacitance (pF)",
      unit: "pF",
      minimum: 0,
    },
    {
      id: "sensitivityPfPerPercent",
      kind: "number",
      label: "Sensitivity (pF/%)",
      unit: "pF/%",
    },
    {
      id: "relativeHumidityPercent",
      kind: "number",
      label: "Relative Humidity (%)",
      unit: "%",
      minimum: 0,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "capacitancePf",
      kind: "number",
      label: "Capacitance (pF)",
      unit: "pF",
    },
  ],
  calculate: (input) =>
    calculateHumiditySensorCapacitance({
      zeroHumidityCapacitancePf: input.zeroHumidityCapacitancePf as number,
      sensitivityPfPerPercent: input.sensitivityPfPerPercent as number,
      relativeHumidityPercent: input.relativeHumidityPercent as number,
    }),
});
export const humiditySensorCapacitanceTool = tool;
export const runHumiditySensorCapacitance = tool.execute;
export default tool;
