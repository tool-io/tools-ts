import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lowestFloorElevationMeters: number;
  readonly baseFloodElevationMeters: number;
  readonly requiredFreeboardMeters: number;
}>;
export type Output = Readonly<{
  readonly elevationDifferenceMeters: number;
  readonly freeboardMarginMeters: number;
  readonly meetsFreeboard: boolean;
}>;

export const calculate = (input: Input): Output => {
  const elevationDifferenceMeters =
      input.lowestFloorElevationMeters - input.baseFloodElevationMeters,
    freeboardMarginMeters =
      elevationDifferenceMeters - input.requiredFreeboardMeters;
  return {
    elevationDifferenceMeters,
    freeboardMarginMeters,
    meetsFreeboard: freeboardMarginMeters >= 0,
  };
};

export const exampleInput = {
  lowestFloorElevationMeters: 12,
  baseFloodElevationMeters: 10,
  requiredFreeboardMeters: 1,
} satisfies Input;
export const exampleOutput = {
  elevationDifferenceMeters: 2,
  freeboardMarginMeters: 1,
  meetsFreeboard: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      lowestFloorElevationMeters: input.lowestFloorElevationMeters as number,
      baseFloodElevationMeters: input.baseFloodElevationMeters as number,
      requiredFreeboardMeters: input.requiredFreeboardMeters as number,
    }),
  description:
    "Compare lowest-floor elevation with base flood elevation and required freeboard.",
  id: "insurance/flood-elevation-margin",
  inputs: [
    {
      id: "lowestFloorElevationMeters",
      label: "Lowest floor elevation",
      kind: "number",
      unit: "m",
    },
    {
      id: "baseFloodElevationMeters",
      label: "Base flood elevation",
      kind: "number",
      unit: "m",
    },
    {
      id: "requiredFreeboardMeters",
      label: "Required freeboard",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "elevationDifferenceMeters",
      label: "Floor minus base flood elevation",
      kind: "number",
      unit: "m",
    },
    {
      id: "freeboardMarginMeters",
      label: "Margin over required freeboard",
      kind: "number",
      unit: "m",
    },
    {
      id: "meetsFreeboard",
      label: "Meets supplied freeboard",
      kind: "boolean",
    },
  ],
  title: "Flood Elevation Margin",
});

export const run = tool.execute;
export default tool;
