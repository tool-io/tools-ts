import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FileSizeFromBitrateRuntimeInput = Readonly<{
  readonly bitrateMegabitsPerSecond: number;
  readonly runtimeSeconds: number;
}>;
export type FileSizeFromBitrateRuntimeOutput = Readonly<{
  readonly fileMegabytes: number;
}>;

export const calculateFileSizeFromBitrateRuntime = (
  x: FileSizeFromBitrateRuntimeInput,
): FileSizeFromBitrateRuntimeOutput => {
  if (
    !Number.isFinite(x.bitrateMegabitsPerSecond) ||
    x.bitrateMegabitsPerSecond < 0
  )
    simpleError(
      "bitrateMegabitsPerSecond",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.runtimeSeconds) || x.runtimeSeconds < 0)
    simpleError("runtimeSeconds", "Provide a finite number at least 0.");
  const fileMegabytes = (x.bitrateMegabitsPerSecond * x.runtimeSeconds) / 8;
  if (!Number.isFinite(fileMegabytes))
    simpleError(
      "fileMegabytes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { fileMegabytes: Object.is(fileMegabytes, -0) ? 0 : fileMegabytes };
};

export const example = {
  input: { bitrateMegabitsPerSecond: 100, runtimeSeconds: 80 },
  output: { fileMegabytes: 1000 },
} satisfies ToolExample<
  FileSizeFromBitrateRuntimeInput,
  FileSizeFromBitrateRuntimeOutput
>;

export const tool = createSimpleTool({
  id: "film/file-size-from-bitrate-runtime",
  title: "File Size From Bitrate Runtime",
  description:
    "Decimal megabyte file size from constant total bitrate in Mb/s and runtime in seconds.",
  inputs: [
    {
      id: "bitrateMegabitsPerSecond",
      kind: "number",
      label: "Bitrate Megabits Per Second",
      unit: "Mb/s",
      minimum: 0,
    },
    {
      id: "runtimeSeconds",
      kind: "number",
      label: "Runtime Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "fileMegabytes",
      kind: "number",
      label: "File Megabytes",
      unit: "MB",
    },
  ],
  calculate: (input) =>
    calculateFileSizeFromBitrateRuntime({
      bitrateMegabitsPerSecond: input.bitrateMegabitsPerSecond as number,
      runtimeSeconds: input.runtimeSeconds as number,
    }),
});
export const fileSizeFromBitrateRuntimeTool = tool;
export const runFileSizeFromBitrateRuntime = tool.execute;
export default tool;
