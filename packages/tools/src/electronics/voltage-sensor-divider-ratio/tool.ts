import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VoltageSensorDividerRatioInput = Readonly<{
  readonly topResistanceOhms: number;
  readonly bottomResistanceOhms: number;
}>;
export type VoltageSensorDividerRatioOutput = Readonly<{
  dividerRatio: number;
}>;

export const calculateVoltageSensorDividerRatio = (
  i: VoltageSensorDividerRatioInput,
): VoltageSensorDividerRatioOutput => {
  if (i.topResistanceOhms + i.bottomResistanceOhms === 0)
    simpleError(
      "bottomResistanceOhms",
      "At least one divider resistance must be positive.",
    );
  const denominator = i.topResistanceOhms + i.bottomResistanceOhms;
  const value = Number.isFinite(denominator)
    ? i.bottomResistanceOhms / denominator
    : i.topResistanceOhms >= i.bottomResistanceOhms
      ? i.bottomResistanceOhms /
        i.topResistanceOhms /
        (1 + i.bottomResistanceOhms / i.topResistanceOhms)
      : 1 / (1 + i.topResistanceOhms / i.bottomResistanceOhms);
  if (!Number.isFinite(value))
    simpleError("dividerRatio", "The inputs produce a non-finite result.");
  return { dividerRatio: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { topResistanceOhms: 10000, bottomResistanceOhms: 10000 },
  output: { dividerRatio: 0.5 },
} satisfies ToolExample<
  VoltageSensorDividerRatioInput,
  VoltageSensorDividerRatioOutput
>;

export const tool = createSimpleTool({
  id: "electronics/voltage-sensor-divider-ratio",
  title: "Voltage Sensor Divider Ratio",
  description:
    "Calculate the unloaded resistive voltage-divider ratio Rbottom/(Rtop+Rbottom); loading and resistor tolerance are excluded.",
  inputs: [
    {
      id: "topResistanceOhms",
      kind: "number",
      label: "Top Resistance (Ω)",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "bottomResistanceOhms",
      kind: "number",
      label: "Bottom Resistance (Ω)",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [{ id: "dividerRatio", kind: "number", label: "Divider Ratio" }],
  calculate: (input) =>
    calculateVoltageSensorDividerRatio({
      topResistanceOhms: input.topResistanceOhms as number,
      bottomResistanceOhms: input.bottomResistanceOhms as number,
    }),
});
export const voltageSensorDividerRatioTool = tool;
export const runVoltageSensorDividerRatio = tool.execute;
export default tool;
