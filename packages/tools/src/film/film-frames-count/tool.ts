import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FilmFramesCountInput = Readonly<{
  readonly footageFeet: number;
  readonly framesPerFoot: number;
}>;
export type FilmFramesCountOutput = Readonly<{
  readonly frameCount: number;
}>;

export const calculateFilmFramesCount = (
  x: FilmFramesCountInput,
): FilmFramesCountOutput => {
  if (!Number.isFinite(x.footageFeet) || x.footageFeet < 0)
    simpleError("footageFeet", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.framesPerFoot) || x.framesPerFoot < 0)
    simpleError("framesPerFoot", "Provide a finite number at least 0.");
  const frameCount = Math.round(x.footageFeet * x.framesPerFoot);
  if (!Number.isFinite(frameCount))
    simpleError(
      "frameCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frameCount: Object.is(frameCount, -0) ? 0 : frameCount };
};

export const example = {
  input: { footageFeet: 100, framesPerFoot: 16 },
  output: { frameCount: 1600 },
} satisfies ToolExample<FilmFramesCountInput, FilmFramesCountOutput>;

export const tool = createSimpleTool({
  id: "film/film-frames-count",
  title: "Film Frames Count",
  description:
    "Approximate exposed frame count from film footage times a specified gauge/perforation-dependent frames-per-foot value.",
  inputs: [
    {
      id: "footageFeet",
      kind: "number",
      label: "Footage Feet",
      unit: "ft",
      minimum: 0,
    },
    {
      id: "framesPerFoot",
      kind: "number",
      label: "Frames Per Foot",
      unit: "frames/ft",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "frameCount", kind: "number", label: "Frame Count", unit: "frames" },
  ],
  calculate: (input) =>
    calculateFilmFramesCount({
      footageFeet: input.footageFeet as number,
      framesPerFoot: input.framesPerFoot as number,
    }),
});
export const filmFramesCountTool = tool;
export const runFilmFramesCount = tool.execute;
export default tool;
