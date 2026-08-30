import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NauticalMileMinuteArcConverterInput = Readonly<{
  readonly nauticalMiles: number;
}>;
export type NauticalMileMinuteArcConverterOutput = Readonly<{
  readonly kilometers: number;
}>;

export const calculateNauticalMileMinuteArcConverter = (
  x: NauticalMileMinuteArcConverterInput,
): NauticalMileMinuteArcConverterOutput => {
  if (!Number.isFinite(x.nauticalMiles) || x.nauticalMiles < 0)
    simpleError("nauticalMiles", "Provide a finite nonnegative number.");
  const kilometers = x.nauticalMiles * 1.852;
  if (!Number.isFinite(kilometers))
    simpleError(
      "kilometers",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { kilometers: Object.is(kilometers, -0) ? 0 : kilometers };
};

export const example = {
  input: {
    nauticalMiles: 60,
  },
  output: { kilometers: 111.12 },
} satisfies ToolExample<
  NauticalMileMinuteArcConverterInput,
  NauticalMileMinuteArcConverterOutput
>;

export const tool = createSimpleTool({
  id: "cartography/nautical-mile-minute-arc-converter",
  title: "Nautical Mile Minute Arc Converter",
  description:
    "Length in kilometres of a supplied number of international nautical miles (1852 m each); useful for approximate chart-minute scales.",
  inputs: [
    {
      id: "nauticalMiles",
      kind: "number",
      label: "Nautical Miles",
      unit: "nmi",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "kilometers", kind: "number", label: "Kilometers", unit: "km" },
  ],
  calculate: (input) =>
    calculateNauticalMileMinuteArcConverter({
      nauticalMiles: input.nauticalMiles as number,
    }),
});
export const nauticalMileMinuteArcConverterTool = tool;
export const runNauticalMileMinuteArcConverter = tool.execute;
export default tool;
