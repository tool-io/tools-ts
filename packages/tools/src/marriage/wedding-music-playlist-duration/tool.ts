import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualPlaylistTrackDurationsSeconds: readonly number[];
  readonly actualPlannedTransitionSeconds: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPlaylistTrackDurationsSeconds",
    label: "Actual playlist track durations seconds",
    kind: "numberList",
  },
  {
    id: "actualPlannedTransitionSeconds",
    label: "Actual planned transition seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.actualPlaylistTrackDurationsSeconds.length ||
    input.actualPlannedTransitionSeconds.length !==
      input.actualPlaylistTrackDurationsSeconds.length - 1
  )
    simpleError(
      "playlist",
      "Actual tracks and exactlyn−1transition durations.",
    );
  [
    input.actualPlaylistTrackDurationsSeconds,
    input.actualPlannedTransitionSeconds,
  ].forEach((v) => v.forEach((x) => nonnegative(x, "seconds")));
  return {
    conditionalPlaylistDurationSeconds:
      sum(input.actualPlaylistTrackDurationsSeconds) +
      sum(input.actualPlannedTransitionSeconds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPlaylistTrackDurationsSeconds: [100, 200],
    actualPlannedTransitionSeconds: [10],
  },
  output: { result: { conditionalPlaylistDurationSeconds: 310 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-music-playlist-duration",
  title: "Wedding Music Playlist Duration Calculator",
  description:
    "Actual playlist duration inventory including separately planned intertrack transitions, not streaming availability or tempo-based duration estimate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
