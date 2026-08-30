import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DcpFileSizeInput = Readonly<{
  readonly totalBitrateMegabitsPerSecond: number;
  readonly runtimeSeconds: number;
}>;
export type DcpFileSizeOutput = Readonly<{
  readonly fileGigabytes: number;
}>;

export const calculateDcpFileSize = (
  x: DcpFileSizeInput,
): DcpFileSizeOutput => {
  if (
    !Number.isFinite(x.totalBitrateMegabitsPerSecond) ||
    x.totalBitrateMegabitsPerSecond < 0
  )
    simpleError(
      "totalBitrateMegabitsPerSecond",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.runtimeSeconds) || x.runtimeSeconds < 0)
    simpleError("runtimeSeconds", "Provide a finite number at least 0.");
  const fileGigabytes =
    (x.totalBitrateMegabitsPerSecond * x.runtimeSeconds) / 8000;
  if (!Number.isFinite(fileGigabytes))
    simpleError(
      "fileGigabytes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { fileGigabytes: Object.is(fileGigabytes, -0) ? 0 : fileGigabytes };
};

export const example = {
  input: { totalBitrateMegabitsPerSecond: 250, runtimeSeconds: 7200 },
  output: { fileGigabytes: 225 },
} satisfies ToolExample<DcpFileSizeInput, DcpFileSizeOutput>;

export const tool = createSimpleTool({
  id: "film/dcp-file-size",
  title: "DCP File Size",
  description:
    "Decimal gigabytes for a DCP or other constant-bitrate file from total Mb/s and running seconds; excludes filesystem overhead.",
  inputs: [
    {
      id: "totalBitrateMegabitsPerSecond",
      kind: "number",
      label: "Total Bitrate Megabits Per Second",
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
      id: "fileGigabytes",
      kind: "number",
      label: "File Gigabytes",
      unit: "GB",
    },
  ],
  calculate: (input) =>
    calculateDcpFileSize({
      totalBitrateMegabitsPerSecond:
        input.totalBitrateMegabitsPerSecond as number,
      runtimeSeconds: input.runtimeSeconds as number,
    }),
});
export const dcpFileSizeTool = tool;
export const runDcpFileSize = tool.execute;
export default tool;
