import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CompassDeviationLookupInput = {
  readonly eastDeviationDeg?: number;
  readonly headingDeg: number;
  readonly northDeviationDeg?: number;
  readonly southDeviationDeg?: number;
  readonly westDeviationDeg?: number;
};

export type CompassDeviationLookupOutput = {
  readonly deviationDeg: number;
};

export const compassDeviationLookupExample = {
  input: { headingDeg: 45 },
  output: { deviationDeg: -1 },
} satisfies ToolExample<
  CompassDeviationLookupInput,
  CompassDeviationLookupOutput
>;

const deviationFor = (
  headingDeg: number,
  input: CompassDeviationLookupInput,
): number => {
  const north = input.northDeviationDeg ?? 0;
  const table: readonly (readonly [number, number])[] = [
    [0, north],
    [90, input.eastDeviationDeg ?? -2],
    [180, input.southDeviationDeg ?? -1],
    [270, input.westDeviationDeg ?? 3],
    [360, north],
  ];
  for (let i = 0; i < table.length - 1; i++) {
    const [fromHeading, fromDeviation] = table[i];
    const [toHeading, toDeviation] = table[i + 1];
    if (headingDeg >= fromHeading && headingDeg <= toHeading)
      return (
        ((headingDeg - fromHeading) / (toHeading - fromHeading)) *
          (toDeviation - fromDeviation) +
        fromDeviation
      );
  }
  return simpleError(
    "headingDeg",
    "Heading is outside the deviation table.",
    "out_of_range",
  );
};

export const compassDeviationLookupTool = createSimpleTool({
  id: "sailing/compass-deviation-lookup",
  title: "Compass Deviation Lookup Calculator",
  description:
    "Interpolate magnetic compass deviation between a vessel's cardinal calibration values. The defaults reproduce the included example card and should be replaced with the vessel's own swing data.",
  inputs: [
    {
      description: "Compass heading by the ship's compass.",
      id: "headingDeg",
      kind: "integer",
      label: "Compass heading",
      maximum: 360,
      minimum: 0,
      unit: "\u00B0",
    },
    {
      default: 0,
      description: "Deviation recorded on north; positive east, negative west.",
      id: "northDeviationDeg",
      kind: "number",
      label: "North deviation",
      unit: "°",
    },
    {
      default: -2,
      description: "Deviation recorded on east; positive east, negative west.",
      id: "eastDeviationDeg",
      kind: "number",
      label: "East deviation",
      unit: "°",
    },
    {
      default: -1,
      description: "Deviation recorded on south; positive east, negative west.",
      id: "southDeviationDeg",
      kind: "number",
      label: "South deviation",
      unit: "°",
    },
    {
      default: 3,
      description: "Deviation recorded on west; positive east, negative west.",
      id: "westDeviationDeg",
      kind: "number",
      label: "West deviation",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Positive east, negative west deviation.",
      format: "angle",
      id: "deviationDeg",
      kind: "number",
      label: "Deviation",
      unit: "\u00B0",
    },
  ],
  calculate: (input) => ({
    deviationDeg: deviationFor(
      input.headingDeg as number,
      input as unknown as CompassDeviationLookupInput,
    ),
  }),
});
export const runCompassDeviationLookup = compassDeviationLookupTool.execute;
export default compassDeviationLookupTool;
