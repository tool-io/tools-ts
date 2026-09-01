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
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly stageDepthM: number;
  readonly plannedLegBorderSetDepthsM: readonly number[];
  readonly callerMaximumUnmaskedDepthIntervalM: number;
}>;
export type Output = Readonly<{
  readonly plannedLegBorderSetCount: number;
  readonly depthBoundaryIntervalsM: readonly number[];
  readonly intervalsAboveCallerMaskingBudget: readonly number[];
}>;
const inputFields = [
  { id: "stageDepthM", label: "Stage depth m", kind: "number" },
  {
    id: "plannedLegBorderSetDepthsM",
    label: "Planned leg border set depths m",
    kind: "numberList",
  },
  {
    id: "callerMaximumUnmaskedDepthIntervalM",
    label: "Caller maximum unmasked depth interval m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stageDepthM, "stageDepthM");
  positive(
    input.callerMaximumUnmaskedDepthIntervalM,
    "callerMaximumUnmaskedDepthIntervalM",
  );
  sequence(input.plannedLegBorderSetDepthsM, "sets");
  if (
    input.plannedLegBorderSetDepthsM.some((v) => v > input.stageDepthM) ||
    new Set(input.plannedLegBorderSetDepthsM).size !==
      input.plannedLegBorderSetDepthsM.length
  )
    simpleError("sets", "Distinct measured set depths within stage required.");
  const p = [0, ...input.plannedLegBorderSetDepthsM, input.stageDepthM],
    d = p.slice(1).map((v, i) => v - p[i]);
  return {
    plannedLegBorderSetCount: input.plannedLegBorderSetDepthsM.length,
    depthBoundaryIntervalsM: d,
    intervalsAboveCallerMaskingBudget: d.flatMap((v, i) =>
      v > input.callerMaximumUnmaskedDepthIntervalM ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stageDepthM: 8,
  plannedLegBorderSetDepthsM: [2, 4, 6],
  callerMaximumUnmaskedDepthIntervalM: 2,
} satisfies Input;
export const exampleOutput = {
  plannedLegBorderSetCount: 3,
  depthBoundaryIntervalsM: [2, 2, 2, 2],
  intervalsAboveCallerMaskingBudget: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/leg-border-set-number-by-stage-width-lookup",
  title: "Leg Border Set Number By Stage Width Lookup",
  description:
    "Audit actual leg/border set depth intervals including front/back tails under caller masking-plan budget; not stage-width-alone universal set count, audience sightline proof or rigging positions.",
  inputs: inputFields,
  outputs: [
    {
      id: "plannedLegBorderSetCount",
      label: "Planned leg border set count",
      kind: "number",
    },
    {
      id: "depthBoundaryIntervalsM",
      label: "Depth boundary intervals m",
      kind: "numberList",
    },
    {
      id: "intervalsAboveCallerMaskingBudget",
      label: "Intervals above caller masking budget",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      stageDepthM: value.stageDepthM as number,
      plannedLegBorderSetDepthsM:
        value.plannedLegBorderSetDepthsM as readonly number[],
      callerMaximumUnmaskedDepthIntervalM:
        value.callerMaximumUnmaskedDepthIntervalM as number,
    }),
});
export const run = tool.execute;
export default tool;
