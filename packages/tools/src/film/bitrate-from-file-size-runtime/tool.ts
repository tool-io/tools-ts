import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BitrateFromFileSizeRuntimeInput = Readonly<{
  readonly fileMegabytes: number;
  readonly runtimeSeconds: number;
}>;
export type BitrateFromFileSizeRuntimeOutput = Readonly<{
  readonly bitrateMegabitsPerSecond: number;
}>;

export const calculateBitrateFromFileSizeRuntime = (
  x: BitrateFromFileSizeRuntimeInput,
): BitrateFromFileSizeRuntimeOutput => {
  if (!Number.isFinite(x.fileMegabytes) || x.fileMegabytes < 0)
    simpleError("fileMegabytes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.runtimeSeconds) || x.runtimeSeconds < 0)
    simpleError("runtimeSeconds", "Provide a finite number at least 0.");
  const bitrateMegabitsPerSecond = (8 * x.fileMegabytes) / x.runtimeSeconds;
  if (!Number.isFinite(bitrateMegabitsPerSecond))
    simpleError(
      "bitrateMegabitsPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    bitrateMegabitsPerSecond: Object.is(bitrateMegabitsPerSecond, -0)
      ? 0
      : bitrateMegabitsPerSecond,
  };
};

export const example = {
  input: { fileMegabytes: 1000, runtimeSeconds: 100 },
  output: { bitrateMegabitsPerSecond: 80 },
} satisfies ToolExample<
  BitrateFromFileSizeRuntimeInput,
  BitrateFromFileSizeRuntimeOutput
>;

export const tool = createSimpleTool({
  id: "film/bitrate-from-file-size-runtime",
  title: "Bitrate From File Size Runtime",
  description:
    "Average decimal megabits per second from a decimal megabyte file size and duration; includes any audio/container overhead already in the size.",
  inputs: [
    {
      id: "fileMegabytes",
      kind: "number",
      label: "File Megabytes",
      unit: "MB",
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
      id: "bitrateMegabitsPerSecond",
      kind: "number",
      label: "Bitrate Megabits Per Second",
      unit: "Mb/s",
    },
  ],
  calculate: (input) =>
    calculateBitrateFromFileSizeRuntime({
      fileMegabytes: input.fileMegabytes as number,
      runtimeSeconds: input.runtimeSeconds as number,
    }),
});
export const bitrateFromFileSizeRuntimeTool = tool;
export const runBitrateFromFileSizeRuntime = tool.execute;
export default tool;
