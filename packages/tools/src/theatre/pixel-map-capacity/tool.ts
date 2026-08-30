import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly canvasWidthPixels: number;
  readonly canvasHeightPixels: number;
  readonly fixtureCount: number;
  readonly channelsPerFixture: number;
  readonly universeCapacityChannels: number;
}>;
export type Output = Readonly<{
  readonly pixelCount: number;
  readonly requiredChannels: number;
  readonly requiredUniverses: number;
}>;

export const calculate = (input: Input): Output => {
  const pixelCount = input.canvasWidthPixels * input.canvasHeightPixels,
    requiredChannels = input.fixtureCount * input.channelsPerFixture;
  return {
    pixelCount,
    requiredChannels,
    requiredUniverses: Math.ceil(
      requiredChannels / input.universeCapacityChannels,
    ),
  };
};

export const exampleInput = {
  canvasWidthPixels: 1920,
  canvasHeightPixels: 1080,
  fixtureCount: 100,
  channelsPerFixture: 4,
  universeCapacityChannels: 512,
} satisfies Input;
export const exampleOutput = {
  pixelCount: 2073600,
  requiredChannels: 400,
  requiredUniverses: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      canvasWidthPixels: input.canvasWidthPixels as number,
      canvasHeightPixels: input.canvasHeightPixels as number,
      fixtureCount: input.fixtureCount as number,
      channelsPerFixture: input.channelsPerFixture as number,
      universeCapacityChannels: input.universeCapacityChannels as number,
    }),
  description: "Calculate pixel-map canvas size and control-universe capacity.",
  id: "theatre/pixel-map-capacity",
  inputs: [
    {
      id: "canvasWidthPixels",
      label: "Canvas width",
      kind: "integer",
      minimum: 1,
      unit: "px",
    },
    {
      id: "canvasHeightPixels",
      label: "Canvas height",
      kind: "integer",
      minimum: 1,
      unit: "px",
    },
    {
      id: "fixtureCount",
      label: "Mapped fixture count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "channelsPerFixture",
      label: "Channels per fixture",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "universeCapacityChannels",
      label: "Channels per universe",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "pixelCount",
      label: "Canvas pixel count",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "requiredChannels",
      label: "Required output channels",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "requiredUniverses",
      label: "Required universes",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Pixel-Map Capacity",
});

export const run = tool.execute;
export default tool;
