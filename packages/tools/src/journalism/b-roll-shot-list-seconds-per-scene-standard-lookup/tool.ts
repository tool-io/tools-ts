import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  coverage,
  spanRows,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly sceneDurationSeconds: number;
  readonly bRollCoverageIntervalsSeconds: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly unionCoveredSceneSeconds: number;
  readonly uncoveredSceneIntervalsSeconds: readonly (readonly number[])[];
  readonly sceneCoverageFraction: number;
}>;
const inputFields = [
  {
    id: "sceneDurationSeconds",
    label: "Scene duration seconds",
    kind: "number",
  },
  {
    id: "bRollCoverageIntervalsSeconds",
    label: "B roll coverage intervals seconds",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.sceneDurationSeconds, "sceneDurationSeconds");
  spanRows(input.bRollCoverageIntervalsSeconds, input.sceneDurationSeconds);
  const rows = input.bRollCoverageIntervalsSeconds
      .map((r) => [...r])
      .sort((a, b) => a[0] - b[0]),
    gaps: number[][] = [];
  let end = 0;
  for (const [a, b] of rows) {
    if (a > end) gaps.push([end, a]);
    end = Math.max(end, b);
  }
  if (end < input.sceneDurationSeconds)
    gaps.push([end, input.sceneDurationSeconds]);
  if (gaps.length > 128)
    simpleError(
      "gaps",
      "Uncovered gap witnesses exceed matrix row budget; narrow scene.",
    );
  const covered = coverage(rows, input.sceneDurationSeconds);
  return {
    unionCoveredSceneSeconds: covered,
    uncoveredSceneIntervalsSeconds: gaps,
    sceneCoverageFraction: covered / input.sceneDurationSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sceneDurationSeconds: 20,
  bRollCoverageIntervalsSeconds: [
    [0, 10],
    [5, 15],
  ],
} satisfies Input;
export const exampleOutput = {
  unionCoveredSceneSeconds: 15,
  uncoveredSceneIntervalsSeconds: [[15, 20]],
  sceneCoverageFraction: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/b-roll-shot-list-seconds-per-scene-standard-lookup",
  title: "B Roll Shot List Seconds per Scene Standard Lookup",
  description:
    "Audit actual scene B-roll intervals using union coverage without double-counting overlaps, exposing uncovered gaps; no invented standard shot lengths, visual shot suitability, rights clearance or automatic scene segmentation.",
  inputs: inputFields,
  outputs: [
    {
      id: "unionCoveredSceneSeconds",
      label: "Union covered scene seconds",
      kind: "number",
    },
    {
      id: "uncoveredSceneIntervalsSeconds",
      label: "Uncovered scene intervals seconds",
      kind: "matrix",
    },
    {
      id: "sceneCoverageFraction",
      label: "Scene coverage fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sceneDurationSeconds: value.sceneDurationSeconds as number,
      bRollCoverageIntervalsSeconds:
        value.bRollCoverageIntervalsSeconds as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
