import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HydraulicDiameterInput = Readonly<{
  readonly flowAreaSquareMeters: number;
  readonly wettedPerimeterMeters: number;
}>;
export type HydraulicDiameterOutput = Readonly<{
  readonly diameterMeters: number;
}>;

export const calculateHydraulicDiameter = (
  x: HydraulicDiameterInput,
): HydraulicDiameterOutput => {
  if (!Number.isFinite(x.flowAreaSquareMeters) || x.flowAreaSquareMeters < 0)
    simpleError("flowAreaSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wettedPerimeterMeters) || x.wettedPerimeterMeters < 0)
    simpleError("wettedPerimeterMeters", "Provide a finite number at least 0.");
  const diameterMeters = (4 * x.flowAreaSquareMeters) / x.wettedPerimeterMeters;
  if (!Number.isFinite(diameterMeters))
    simpleError(
      "diameterMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { diameterMeters: Object.is(diameterMeters, -0) ? 0 : diameterMeters };
};

export const example = {
  input: { flowAreaSquareMeters: 0.02, wettedPerimeterMeters: 0.6 },
  output: { diameterMeters: 0.13333333333333333 },
} satisfies ToolExample<HydraulicDiameterInput, HydraulicDiameterOutput>;

export const tool = createSimpleTool({
  id: "engineering/hydraulic-diameter",
  title: "Hydraulic Diameter",
  description:
    "Hydraulic diameter 4A/P for a flowing cross section with wetted perimeter P.",
  inputs: [
    {
      id: "flowAreaSquareMeters",
      kind: "number",
      label: "Flow Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "wettedPerimeterMeters",
      kind: "number",
      label: "Wetted Perimeter Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "diameterMeters",
      kind: "number",
      label: "Diameter Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateHydraulicDiameter({
      flowAreaSquareMeters: input.flowAreaSquareMeters as number,
      wettedPerimeterMeters: input.wettedPerimeterMeters as number,
    }),
});
export const hydraulicDiameterTool = tool;
export const runHydraulicDiameter = tool.execute;
export default tool;
