import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DoSaturationInput = Readonly<{
  readonly measuredOxygenMgPerLiter: number;
  readonly saturationOxygenMgPerLiter: number;
}>;
export type DoSaturationOutput = Readonly<{
  readonly oxygenSaturationPercent: number;
}>;

export const calculateDoSaturation = (
  x: DoSaturationInput,
): DoSaturationOutput => {
  if (
    !Number.isFinite(x.measuredOxygenMgPerLiter) ||
    x.measuredOxygenMgPerLiter < 0
  )
    simpleError(
      "measuredOxygenMgPerLiter",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.saturationOxygenMgPerLiter) ||
    x.saturationOxygenMgPerLiter <= 0
  )
    simpleError(
      "saturationOxygenMgPerLiter",
      "Provide a finite positive number.",
    );
  const oxygenSaturationPercent =
    (x.measuredOxygenMgPerLiter / x.saturationOxygenMgPerLiter) * 100;
  if (!Number.isFinite(oxygenSaturationPercent))
    simpleError(
      "oxygenSaturationPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    oxygenSaturationPercent: Object.is(oxygenSaturationPercent, -0)
      ? 0
      : oxygenSaturationPercent,
  };
};

export const example = {
  input: {
    measuredOxygenMgPerLiter: 6,
    saturationOxygenMgPerLiter: 8,
  },
  output: { oxygenSaturationPercent: 75 },
} satisfies ToolExample<DoSaturationInput, DoSaturationOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/do-saturation",
  title: "DO Saturation",
  description:
    "Express measured dissolved oxygen as a percentage of the saturation concentration at the same conditions.",
  inputs: [
    {
      id: "measuredOxygenMgPerLiter",
      kind: "number",
      label: "Measured Oxygen Mg Per Liter",
      unit: "mg/L",
    },
    {
      id: "saturationOxygenMgPerLiter",
      kind: "number",
      label: "Saturation Oxygen Mg Per Liter",
      unit: "mg/L",
    },
  ],
  outputs: [
    {
      id: "oxygenSaturationPercent",
      kind: "number",
      label: "Oxygen Saturation Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateDoSaturation({
      measuredOxygenMgPerLiter: input.measuredOxygenMgPerLiter as number,
      saturationOxygenMgPerLiter: input.saturationOxygenMgPerLiter as number,
    }),
});
export const runDoSaturation = tool.execute;
export default tool;
