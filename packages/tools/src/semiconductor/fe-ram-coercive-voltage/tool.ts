import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FeRamCoerciveVoltageInput = Readonly<{
  readonly coerciveVoltsPerMeter: number;
  readonly filmMeters: number;
}>;
export type FeRamCoerciveVoltageOutput = Readonly<{
  readonly coerciveVolts: number;
}>;

export const calculateFeRamCoerciveVoltage = (
  x: FeRamCoerciveVoltageInput,
): FeRamCoerciveVoltageOutput => {
  if (!Number.isFinite(x.coerciveVoltsPerMeter) || x.coerciveVoltsPerMeter < 0)
    simpleError("coerciveVoltsPerMeter", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.filmMeters) || x.filmMeters < 0)
    simpleError("filmMeters", "Provide a finite number at least 0.");
  const coerciveVolts = x.coerciveVoltsPerMeter * x.filmMeters;
  if (!Number.isFinite(coerciveVolts))
    simpleError(
      "coerciveVolts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { coerciveVolts: Object.is(coerciveVolts, -0) ? 0 : coerciveVolts };
};

export const example = {
  input: { coerciveVoltsPerMeter: 10000000, filmMeters: 1e-7 },
  output: { coerciveVolts: 1 },
} satisfies ToolExample<FeRamCoerciveVoltageInput, FeRamCoerciveVoltageOutput>;

export const tool = createSimpleTool({
  id: "semiconductor/fe-ram-coercive-voltage",
  title: "Fe Ram Coercive Voltage",
  description:
    "Ideal ferroelectric switching-voltage magnitude from measured coercive field and ferroelectric film thickness.",
  inputs: [
    {
      id: "coerciveVoltsPerMeter",
      kind: "number",
      label: "Coercive Volts Per Meter",
      unit: "V/m",
      minimum: 0,
    },
    {
      id: "filmMeters",
      kind: "number",
      label: "Film Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "coerciveVolts", kind: "number", label: "Coercive Volts", unit: "V" },
  ],
  calculate: (input) =>
    calculateFeRamCoerciveVoltage({
      coerciveVoltsPerMeter: input.coerciveVoltsPerMeter as number,
      filmMeters: input.filmMeters as number,
    }),
});
export const feRamCoerciveVoltageTool = tool;
export const runFeRamCoerciveVoltage = tool.execute;
export default tool;
