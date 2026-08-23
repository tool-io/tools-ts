import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CompassHeadingInput = {
  readonly deviationDeg: number;
  readonly magneticHeadingDeg: number;
};

export type CompassHeadingOutput = {
  readonly compassHeadingDeg: number;
};

const norm = (value: number): number => ((value % 360) + 360) % 360;

export const compassHeadingExample = {
  input: { deviationDeg: 2, magneticHeadingDeg: 350 },
} satisfies ToolExample<CompassHeadingInput>;

export const compassHeadingTool = createSimpleTool({
  id: "aviation/compass-heading",
  title: "Compass Heading Calculator",
  description:
    "Convert a magnetic heading to a compass heading by applying the compass deviation.",
  inputs: [
    {
      description: "Compass deviation; positive values subtract from heading.",
      id: "deviationDeg",
      label: "Deviation",
      kind: "number",
      maximum: 30,
      minimum: -30,
      unit: "°",
    },
    {
      id: "magneticHeadingDeg",
      label: "Magnetic heading",
      kind: "number",
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "compassHeadingDeg",
      label: "Compass heading",
      kind: "number",
      unit: "°",
    },
  ],
  calculate: (input) => ({
    compassHeadingDeg: norm(
      (input.magneticHeadingDeg as number) - (input.deviationDeg as number),
    ),
  }),
});
export const runCompassHeading = compassHeadingTool.execute;
export default compassHeadingTool;
