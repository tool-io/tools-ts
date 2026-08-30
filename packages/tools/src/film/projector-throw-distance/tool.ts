import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProjectorThrowDistanceInput = Readonly<{
  readonly screenWidthMeters: number;
  readonly throwRatio: number;
}>;
export type ProjectorThrowDistanceOutput = Readonly<{
  readonly throwMeters: number;
}>;

export const calculateProjectorThrowDistance = (
  x: ProjectorThrowDistanceInput,
): ProjectorThrowDistanceOutput => {
  if (!Number.isFinite(x.screenWidthMeters) || x.screenWidthMeters < 0)
    simpleError("screenWidthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.throwRatio) || x.throwRatio < 0)
    simpleError("throwRatio", "Provide a finite number at least 0.");
  const throwMeters = x.screenWidthMeters * x.throwRatio;
  if (!Number.isFinite(throwMeters))
    simpleError(
      "throwMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { throwMeters: Object.is(throwMeters, -0) ? 0 : throwMeters };
};

export const example = {
  input: { screenWidthMeters: 2, throwRatio: 2 },
  output: { throwMeters: 4 },
} satisfies ToolExample<
  ProjectorThrowDistanceInput,
  ProjectorThrowDistanceOutput
>;

export const tool = createSimpleTool({
  id: "film/projector-throw-distance",
  title: "Projector Throw Distance",
  description:
    "Projection throw distance from image width times a specified lens throw ratio.",
  inputs: [
    {
      id: "screenWidthMeters",
      kind: "number",
      label: "Screen Width Meters",
      unit: "m",
      minimum: 0,
    },
    { id: "throwRatio", kind: "number", label: "Throw Ratio", minimum: 0 },
  ],
  outputs: [
    { id: "throwMeters", kind: "number", label: "Throw Meters", unit: "m" },
  ],
  calculate: (input) =>
    calculateProjectorThrowDistance({
      screenWidthMeters: input.screenWidthMeters as number,
      throwRatio: input.throwRatio as number,
    }),
});
export const projectorThrowDistanceTool = tool;
export const runProjectorThrowDistance = tool.execute;
export default tool;
