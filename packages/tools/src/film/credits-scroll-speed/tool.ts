import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CreditsScrollSpeedInput = Readonly<{
  readonly traveledPixels: number;
  readonly durationSeconds: number;
}>;
export type CreditsScrollSpeedOutput = Readonly<{
  readonly pixelsPerSecond: number;
}>;

export const calculateCreditsScrollSpeed = (
  x: CreditsScrollSpeedInput,
): CreditsScrollSpeedOutput => {
  if (!Number.isFinite(x.traveledPixels) || x.traveledPixels < 0)
    simpleError("traveledPixels", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.durationSeconds) || x.durationSeconds < 0)
    simpleError("durationSeconds", "Provide a finite number at least 0.");
  const pixelsPerSecond = x.traveledPixels / x.durationSeconds;
  if (!Number.isFinite(pixelsPerSecond))
    simpleError(
      "pixelsPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pixelsPerSecond: Object.is(pixelsPerSecond, -0) ? 0 : pixelsPerSecond,
  };
};

export const example = {
  input: { traveledPixels: 1000, durationSeconds: 20 },
  output: { pixelsPerSecond: 50 },
} satisfies ToolExample<CreditsScrollSpeedInput, CreditsScrollSpeedOutput>;

export const tool = createSimpleTool({
  id: "film/credits-scroll-speed",
  title: "Credits Scroll Speed",
  description:
    "Average vertical credits scroll speed from total traveled pixels and scroll duration.",
  inputs: [
    {
      id: "traveledPixels",
      kind: "integer",
      label: "Traveled Pixels",
      unit: "px",
      minimum: 0,
    },
    {
      id: "durationSeconds",
      kind: "number",
      label: "Duration Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pixelsPerSecond",
      kind: "number",
      label: "Pixels Per Second",
      unit: "px/s",
    },
  ],
  calculate: (input) =>
    calculateCreditsScrollSpeed({
      traveledPixels: input.traveledPixels as number,
      durationSeconds: input.durationSeconds as number,
    }),
});
export const creditsScrollSpeedTool = tool;
export const runCreditsScrollSpeed = tool.execute;
export default tool;
