import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReelRuntime2000ftInput = Readonly<{
  readonly framesPerFoot: number;
  readonly framesPerSecond: number;
}>;
export type ReelRuntime2000ftOutput = Readonly<{
  readonly runtimeMinutes: number;
}>;

export const calculateReelRuntime2000ft = (
  x: ReelRuntime2000ftInput,
): ReelRuntime2000ftOutput => {
  if (!Number.isFinite(x.framesPerFoot) || x.framesPerFoot < 0)
    simpleError("framesPerFoot", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.framesPerSecond) || x.framesPerSecond < 0)
    simpleError("framesPerSecond", "Provide a finite number at least 0.");
  const runtimeMinutes = (2000 * x.framesPerFoot) / (x.framesPerSecond * 60);
  if (!Number.isFinite(runtimeMinutes))
    simpleError(
      "runtimeMinutes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { runtimeMinutes: Object.is(runtimeMinutes, -0) ? 0 : runtimeMinutes };
};

export const example = {
  input: { framesPerFoot: 16, framesPerSecond: 24 },
  output: { runtimeMinutes: 22.22222222222222 },
} satisfies ToolExample<ReelRuntime2000ftInput, ReelRuntime2000ftOutput>;

export const tool = createSimpleTool({
  id: "film/reel-runtime-2000ft",
  title: "Reel Runtime 2000 ft",
  description:
    "Runtime of a nominal 2,000-foot reel from gauge-dependent frames per foot and projection frame rate.",
  inputs: [
    {
      id: "framesPerFoot",
      kind: "number",
      label: "Frames Per Foot",
      unit: "frames/ft",
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
      id: "runtimeMinutes",
      kind: "number",
      label: "Runtime Minutes",
      unit: "min",
    },
  ],
  calculate: (input) =>
    calculateReelRuntime2000ft({
      framesPerFoot: input.framesPerFoot as number,
      framesPerSecond: input.framesPerSecond as number,
    }),
});
export const reelRuntime2000ftTool = tool;
export const runReelRuntime2000ft = tool.execute;
export default tool;
