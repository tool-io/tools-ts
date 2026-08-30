import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DataRateUncompressedInput = Readonly<{
  readonly widthPixels: number;
  readonly heightPixels: number;
  readonly bitsPerPixel: number;
  readonly framesPerSecond: number;
}>;
export type DataRateUncompressedOutput = Readonly<{
  readonly megabytesPerSecond: number;
}>;

export const calculateDataRateUncompressed = (
  x: DataRateUncompressedInput,
): DataRateUncompressedOutput => {
  if (!Number.isFinite(x.widthPixels) || x.widthPixels < 1)
    simpleError("widthPixels", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.heightPixels) || x.heightPixels < 1)
    simpleError("heightPixels", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.bitsPerPixel) || x.bitsPerPixel < 0)
    simpleError("bitsPerPixel", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.framesPerSecond) || x.framesPerSecond < 0)
    simpleError("framesPerSecond", "Provide a finite number at least 0.");
  if (
    !Number.isSafeInteger(x.widthPixels) ||
    !Number.isSafeInteger(x.heightPixels)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const megabytesPerSecond =
    (x.widthPixels * x.heightPixels * x.bitsPerPixel * x.framesPerSecond) /
    8000000;
  if (!Number.isFinite(megabytesPerSecond))
    simpleError(
      "megabytesPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    megabytesPerSecond: Object.is(megabytesPerSecond, -0)
      ? 0
      : megabytesPerSecond,
  };
};

export const example = {
  input: {
    widthPixels: 1920,
    heightPixels: 1080,
    bitsPerPixel: 24,
    framesPerSecond: 30,
  },
  output: { megabytesPerSecond: 186.624 },
} satisfies ToolExample<DataRateUncompressedInput, DataRateUncompressedOutput>;

export const tool = createSimpleTool({
  id: "film/data-rate-uncompressed",
  title: "Data Rate Uncompressed",
  description:
    "Decimal megabytes per second for uncompressed constant-frame-rate raster video; excludes headers and audio.",
  inputs: [
    {
      id: "widthPixels",
      kind: "integer",
      label: "Width Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "heightPixels",
      kind: "integer",
      label: "Height Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "bitsPerPixel",
      kind: "number",
      label: "Bits Per Pixel",
      unit: "bit/px",
      minimum: 0,
    },
    {
      id: "framesPerSecond",
      kind: "number",
      label: "Frames Per Second",
      unit: "fps",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "megabytesPerSecond",
      kind: "number",
      label: "Megabytes Per Second",
      unit: "MB/s",
    },
  ],
  calculate: (input) =>
    calculateDataRateUncompressed({
      widthPixels: input.widthPixels as number,
      heightPixels: input.heightPixels as number,
      bitsPerPixel: input.bitsPerPixel as number,
      framesPerSecond: input.framesPerSecond as number,
    }),
});
export const dataRateUncompressedTool = tool;
export const runDataRateUncompressed = tool.execute;
export default tool;
