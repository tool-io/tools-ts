import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
  aligned,
  intervalUnion,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSpikeTimesSeconds: readonly number[];
  readonly callerQualifiedWindowStartsSeconds: readonly number[];
  readonly callerQualifiedWindowEndsSeconds: readonly number[];
  readonly callerQualifiedProtocolContext: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSpikeTimesSeconds",
    label: "Actual spike times seconds",
    kind: "numberList",
  },
  {
    id: "callerQualifiedWindowStartsSeconds",
    label: "Caller qualified window starts seconds",
    kind: "numberList",
  },
  {
    id: "callerQualifiedWindowEndsSeconds",
    label: "Caller qualified window ends seconds",
    kind: "numberList",
  },
  {
    id: "callerQualifiedProtocolContext",
    label: "Caller qualified protocol context",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.callerQualifiedProtocolContext.trim())
    simpleError("context", "Actual independently classified windows/protocol.");
  aligned(
    input.callerQualifiedWindowStartsSeconds,
    input.callerQualifiedWindowEndsSeconds,
    "windows",
  );
  const intervals = intervalUnion(
    input.callerQualifiedWindowStartsSeconds.map((v, i) => [
      v,
      input.callerQualifiedWindowEndsSeconds[i],
    ]),
  );
  if (
    input.actualSpikeTimesSeconds.some(
      (v, i) => v < 0 || (i && v <= input.actualSpikeTimesSeconds[i - 1]),
    )
  )
    simpleError("spikes", "Actualnonnegativedistinctorderedspiketimes.");
  const t = positive(sum(intervals.map((r) => r[1] - r[0])), "exposure"),
    count = input.actualSpikeTimesSeconds.filter((v) =>
      intervals.some((r) => v >= r[0] && v < r[1]),
    ).length;
  return {
    actualQualifiedSpikeCount: count,
    actualQualifiedExposureSeconds: t,
    observedConditionalRatePerSecond: count / t,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSpikeTimesSeconds: [0.5, 1.5, 2.5],
    callerQualifiedWindowStartsSeconds: [0, 2],
    callerQualifiedWindowEndsSeconds: [1, 3],
    callerQualifiedProtocolContext:
      "independently classified tonic actual observed exposure/windows",
  },
  output: {
    result: {
      actualQualifiedSpikeCount: 2,
      actualQualifiedExposureSeconds: 2,
      observedConditionalRatePerSecond: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/tonic-firing-rate",
  title: "Tonic Firing Rate Calculator",
  description:
    "Actual independently classified tonic qualified spike count over independently classified half open windows UNION; overlaps no double count. Does not infer baseline/spontaneous/tonic/phasic labels from rate, bin ned peak or burst pattern. Protocol/window classification actual external evidence, not automatic neural phenotype.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
