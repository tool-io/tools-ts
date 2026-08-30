import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TextureMemoryRequiredInput = Readonly<{
  readonly widthPixels: number;
  readonly heightPixels: number;
  readonly channels: number;
  readonly bytesPerChannel: number;
  readonly textureCount: number;
}>;
export type TextureMemoryRequiredOutput = Readonly<{
  readonly mebibytes: number;
}>;

export const calculateTextureMemoryRequired = (
  x: TextureMemoryRequiredInput,
): TextureMemoryRequiredOutput => {
  if (
    !Number.isFinite(x.widthPixels) ||
    !Number.isSafeInteger(x.widthPixels) ||
    x.widthPixels < 1
  )
    simpleError("widthPixels", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.heightPixels) ||
    !Number.isSafeInteger(x.heightPixels) ||
    x.heightPixels < 1
  )
    simpleError("heightPixels", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.channels) ||
    !Number.isSafeInteger(x.channels) ||
    x.channels < 1
  )
    simpleError("channels", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.bytesPerChannel) ||
    !Number.isSafeInteger(x.bytesPerChannel) ||
    x.bytesPerChannel < 1
  )
    simpleError("bytesPerChannel", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.textureCount) ||
    !Number.isSafeInteger(x.textureCount) ||
    x.textureCount < 1
  )
    simpleError("textureCount", "Provide a positive safe integer.");
  const mebibytes =
    (x.widthPixels *
      x.heightPixels *
      x.channels *
      x.bytesPerChannel *
      x.textureCount) /
    1048576;
  if (!Number.isFinite(mebibytes))
    simpleError(
      "mebibytes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { mebibytes: Object.is(mebibytes, -0) ? 0 : mebibytes };
};

export const example = {
  input: {
    widthPixels: 1024,
    heightPixels: 1024,
    channels: 4,
    bytesPerChannel: 1,
    textureCount: 1,
  },
  output: { mebibytes: 4 },
} satisfies ToolExample<
  TextureMemoryRequiredInput,
  TextureMemoryRequiredOutput
>;

export const tool = createSimpleTool({
  id: "vr/texture-memory-required",
  title: "Texture Memory Required",
  description:
    "Uncompressed texture storage in MiB from dimensions, channel count, bytes per channel and texture count; excludes mipmaps and padding.",
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
    { id: "channels", kind: "integer", label: "Channels", minimum: 1 },
    {
      id: "bytesPerChannel",
      kind: "integer",
      label: "Bytes Per Channel",
      unit: "bytes",
      minimum: 1,
    },
    { id: "textureCount", kind: "integer", label: "Texture Count", minimum: 1 },
  ],
  outputs: [
    { id: "mebibytes", kind: "number", label: "Mebibytes", unit: "MiB" },
  ],
  calculate: (input) =>
    calculateTextureMemoryRequired({
      widthPixels: input.widthPixels as number,
      heightPixels: input.heightPixels as number,
      channels: input.channels as number,
      bytesPerChannel: input.bytesPerChannel as number,
      textureCount: input.textureCount as number,
    }),
});
export const textureMemoryRequiredTool = tool;
export const runTextureMemoryRequired = tool.execute;
export default tool;
