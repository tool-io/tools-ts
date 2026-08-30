import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProjectorScreenWidthInput = Readonly<{
  readonly throwMeters: number;
  readonly throwRatio: number;
}>;
export type ProjectorScreenWidthOutput = Readonly<{
  readonly screenWidthMeters: number;
}>;

export const calculateProjectorScreenWidth = (
  x: ProjectorScreenWidthInput,
): ProjectorScreenWidthOutput => {
  if (!Number.isFinite(x.throwMeters) || x.throwMeters < 0)
    simpleError("throwMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.throwRatio) || x.throwRatio < 0)
    simpleError("throwRatio", "Provide a finite number at least 0.");
  const screenWidthMeters = x.throwMeters / x.throwRatio;
  if (!Number.isFinite(screenWidthMeters))
    simpleError(
      "screenWidthMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    screenWidthMeters: Object.is(screenWidthMeters, -0) ? 0 : screenWidthMeters,
  };
};

export const example = {
  input: { throwMeters: 4, throwRatio: 2 },
  output: { screenWidthMeters: 2 },
} satisfies ToolExample<ProjectorScreenWidthInput, ProjectorScreenWidthOutput>;

export const tool = createSimpleTool({
  id: "film/projector-screen-width",
  title: "Projector Screen Width",
  description:
    "Projected image width from lens-to-screen throw distance divided by lens throw ratio.",
  inputs: [
    {
      id: "throwMeters",
      kind: "number",
      label: "Throw Meters",
      unit: "m",
      minimum: 0,
    },
    { id: "throwRatio", kind: "number", label: "Throw Ratio", minimum: 0 },
  ],
  outputs: [
    {
      id: "screenWidthMeters",
      kind: "number",
      label: "Screen Width Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateProjectorScreenWidth({
      throwMeters: input.throwMeters as number,
      throwRatio: input.throwRatio as number,
    }),
});
export const projectorScreenWidthTool = tool;
export const runProjectorScreenWidth = tool.execute;
export default tool;
