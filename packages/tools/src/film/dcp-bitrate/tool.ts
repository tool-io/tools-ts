import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DcpBitrateInput = Readonly<{
  readonly fileGigabytes: number;
  readonly runtimeSeconds: number;
}>;
export type DcpBitrateOutput = Readonly<{
  readonly bitrateMegabitsPerSecond: number;
}>;

export const calculateDcpBitrate = (x: DcpBitrateInput): DcpBitrateOutput => {
  if (!Number.isFinite(x.fileGigabytes) || x.fileGigabytes < 0)
    simpleError("fileGigabytes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.runtimeSeconds) || x.runtimeSeconds < 0)
    simpleError("runtimeSeconds", "Provide a finite number at least 0.");
  const bitrateMegabitsPerSecond = (x.fileGigabytes * 8000) / x.runtimeSeconds;
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
  input: { fileGigabytes: 225, runtimeSeconds: 7200 },
  output: { bitrateMegabitsPerSecond: 250 },
} satisfies ToolExample<DcpBitrateInput, DcpBitrateOutput>;

export const tool = createSimpleTool({
  id: "film/dcp-bitrate",
  title: "DCP Bitrate",
  description:
    "Average total DCP bitrate in decimal Mb/s from decimal gigabytes and running seconds.",
  inputs: [
    {
      id: "fileGigabytes",
      kind: "number",
      label: "File Gigabytes",
      unit: "GB",
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
    calculateDcpBitrate({
      fileGigabytes: input.fileGigabytes as number,
      runtimeSeconds: input.runtimeSeconds as number,
    }),
});
export const dcpBitrateTool = tool;
export const runDcpBitrate = tool.execute;
export default tool;
