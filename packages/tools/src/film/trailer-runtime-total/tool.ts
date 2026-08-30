import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrailerRuntimeTotalInput = Readonly<{
  readonly trailerCount: number;
  readonly meanTrailerMinutes: number;
}>;
export type TrailerRuntimeTotalOutput = Readonly<{
  readonly totalTrailerMinutes: number;
}>;

export const calculateTrailerRuntimeTotal = (
  x: TrailerRuntimeTotalInput,
): TrailerRuntimeTotalOutput => {
  if (!Number.isFinite(x.trailerCount) || x.trailerCount < 0)
    simpleError("trailerCount", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.meanTrailerMinutes) || x.meanTrailerMinutes < 0)
    simpleError("meanTrailerMinutes", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.trailerCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const totalTrailerMinutes = x.trailerCount * x.meanTrailerMinutes;
  if (!Number.isFinite(totalTrailerMinutes))
    simpleError(
      "totalTrailerMinutes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    totalTrailerMinutes: Object.is(totalTrailerMinutes, -0)
      ? 0
      : totalTrailerMinutes,
  };
};

export const example = {
  input: { trailerCount: 3, meanTrailerMinutes: 2 },
  output: { totalTrailerMinutes: 6 },
} satisfies ToolExample<TrailerRuntimeTotalInput, TrailerRuntimeTotalOutput>;

export const tool = createSimpleTool({
  id: "film/trailer-runtime-total",
  title: "Trailer Runtime Total",
  description:
    "Total trailer runtime estimated from trailer count and mean trailer duration; excludes feature and intermission.",
  inputs: [
    { id: "trailerCount", kind: "integer", label: "Trailer Count", minimum: 0 },
    {
      id: "meanTrailerMinutes",
      kind: "number",
      label: "Mean Trailer Minutes",
      unit: "min",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalTrailerMinutes",
      kind: "number",
      label: "Total Trailer Minutes",
      unit: "min",
    },
  ],
  calculate: (input) =>
    calculateTrailerRuntimeTotal({
      trailerCount: input.trailerCount as number,
      meanTrailerMinutes: input.meanTrailerMinutes as number,
    }),
});
export const trailerRuntimeTotalTool = tool;
export const runTrailerRuntimeTotal = tool.execute;
export default tool;
