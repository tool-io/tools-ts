import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CplDurationInput = Readonly<{
  readonly frameCount: number;
  readonly editRateFramesPerSecond: number;
}>;
export type CplDurationOutput = Readonly<{
  readonly durationSeconds: number;
}>;

export const calculateCplDuration = (
  x: CplDurationInput,
): CplDurationOutput => {
  if (!Number.isFinite(x.frameCount) || x.frameCount < 0)
    simpleError("frameCount", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.editRateFramesPerSecond) ||
    x.editRateFramesPerSecond < 0
  )
    simpleError(
      "editRateFramesPerSecond",
      "Provide a finite number at least 0.",
    );
  if (!Number.isSafeInteger(x.frameCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const durationSeconds = x.frameCount / x.editRateFramesPerSecond;
  if (!Number.isFinite(durationSeconds))
    simpleError(
      "durationSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    durationSeconds: Object.is(durationSeconds, -0) ? 0 : durationSeconds,
  };
};

export const example = {
  input: { frameCount: 2400, editRateFramesPerSecond: 24 },
  output: { durationSeconds: 100 },
} satisfies ToolExample<CplDurationInput, CplDurationOutput>;

export const tool = createSimpleTool({
  id: "film/cpl-duration",
  title: "CPL Duration",
  description:
    "Composition playlist timeline duration from frame count and edit rate, excluding any external pre-show content.",
  inputs: [
    {
      id: "frameCount",
      kind: "integer",
      label: "Frame Count",
      unit: "frames",
      minimum: 0,
    },
    {
      id: "editRateFramesPerSecond",
      kind: "number",
      label: "Edit Rate Frames Per Second",
      unit: "fps",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "durationSeconds",
      kind: "number",
      label: "Duration Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateCplDuration({
      frameCount: input.frameCount as number,
      editRateFramesPerSecond: input.editRateFramesPerSecond as number,
    }),
});
export const cplDurationTool = tool;
export const runCplDuration = tool.execute;
export default tool;
