import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProjectorThrowRatioInput = Readonly<{
  readonly throwMeters: number;
  readonly screenWidthMeters: number;
}>;
export type ProjectorThrowRatioOutput = Readonly<{
  readonly throwRatio: number;
}>;

export const calculateProjectorThrowRatio = (
  x: ProjectorThrowRatioInput,
): ProjectorThrowRatioOutput => {
  if (!Number.isFinite(x.throwMeters) || x.throwMeters < 0)
    simpleError("throwMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.screenWidthMeters) || x.screenWidthMeters < 0)
    simpleError("screenWidthMeters", "Provide a finite number at least 0.");
  const throwRatio = x.throwMeters / x.screenWidthMeters;
  if (!Number.isFinite(throwRatio))
    simpleError(
      "throwRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { throwRatio: Object.is(throwRatio, -0) ? 0 : throwRatio };
};

export const example = {
  input: { throwMeters: 4, screenWidthMeters: 2 },
  output: { throwRatio: 2 },
} satisfies ToolExample<ProjectorThrowRatioInput, ProjectorThrowRatioOutput>;

export const tool = createSimpleTool({
  id: "film/projector-throw-ratio",
  title: "Projector Throw Ratio",
  description:
    "Projector throw ratio as lens-to-screen distance divided by projected image width in matching units.",
  inputs: [
    {
      id: "throwMeters",
      kind: "number",
      label: "Throw Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "screenWidthMeters",
      kind: "number",
      label: "Screen Width Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "throwRatio", kind: "number", label: "Throw Ratio" }],
  calculate: (input) =>
    calculateProjectorThrowRatio({
      throwMeters: input.throwMeters as number,
      screenWidthMeters: input.screenWidthMeters as number,
    }),
});
export const projectorThrowRatioTool = tool;
export const runProjectorThrowRatio = tool.execute;
export default tool;
