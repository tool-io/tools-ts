import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StatuteNauticalChartConverterInput = Readonly<{
  readonly statuteMiles: number;
}>;
export type StatuteNauticalChartConverterOutput = Readonly<{
  readonly nauticalMiles: number;
}>;

export const calculateStatuteNauticalChartConverter = (
  x: StatuteNauticalChartConverterInput,
): StatuteNauticalChartConverterOutput => {
  if (!Number.isFinite(x.statuteMiles) || x.statuteMiles < 0)
    simpleError("statuteMiles", "Provide a finite nonnegative number.");
  const nauticalMiles = (x.statuteMiles * 1609.344) / 1852;
  if (!Number.isFinite(nauticalMiles))
    simpleError(
      "nauticalMiles",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { nauticalMiles: Object.is(nauticalMiles, -0) ? 0 : nauticalMiles };
};

export const example = {
  input: {
    statuteMiles: 10,
  },
  output: { nauticalMiles: 8.68976241900648 },
} satisfies ToolExample<
  StatuteNauticalChartConverterInput,
  StatuteNauticalChartConverterOutput
>;

export const tool = createSimpleTool({
  id: "cartography/statute-nautical-chart-converter",
  title: "Statute Nautical Chart Converter",
  description:
    "International nautical miles from international statute miles (1609.344 m and 1852 m respectively).",
  inputs: [
    {
      id: "statuteMiles",
      kind: "number",
      label: "Statute Miles",
      unit: "mi",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "nauticalMiles",
      kind: "number",
      label: "Nautical Miles",
      unit: "nmi",
    },
  ],
  calculate: (input) =>
    calculateStatuteNauticalChartConverter({
      statuteMiles: input.statuteMiles as number,
    }),
});
export const statuteNauticalChartConverterTool = tool;
export const runStatuteNauticalChartConverter = tool.execute;
export default tool;
