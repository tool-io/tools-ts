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
  bounded,
  aligned,
  unique,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedMos2LayerCounts: readonly number[];
  readonly callerMeasuredMos2GapEv: readonly number[];
  readonly queryMos2LayerCount: number;
  readonly observedQueryMos2GapEv: number;
}>;
export type Output = Readonly<{
  readonly callerMos2ReferenceGapEv: number;
  readonly signedObservedMos2GapDifferenceEv: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedMos2LayerCounts",
    label: "Caller verified mos2 layer counts",
    kind: "numberList",
  },
  {
    id: "callerMeasuredMos2GapEv",
    label: "Caller measured mos2 gap ev",
    kind: "numberList",
  },
  {
    id: "queryMos2LayerCount",
    label: "Query mos2 layer count",
    kind: "number",
  },
  {
    id: "observedQueryMos2GapEv",
    label: "Observed query mos2 gap ev",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMeasuredMos2GapEv.forEach((v) =>
    positive(v, "callerMeasuredMos2GapEv"),
  );
  positive(input.observedQueryMos2GapEv, "observedQueryMos2GapEv");
  input.callerVerifiedMos2LayerCounts.forEach((v) =>
    bounded(v, "layers", 1, 1000),
  );
  unique(input.callerVerifiedMos2LayerCounts.map(String), "layers");
  bounded(input.queryMos2LayerCount, "layers", 1, 1000);
  aligned(
    input.callerVerifiedMos2LayerCounts,
    input.callerMeasuredMos2GapEv,
    "layers",
  );
  const i = input.callerVerifiedMos2LayerCounts.indexOf(
    input.queryMos2LayerCount,
  );
  if (i < 0)
    simpleError(
      "layer",
      "Query layer count absent from independently measured MoS2 catalog.",
    );
  const gap = input.callerMeasuredMos2GapEv[i];
  return {
    callerMos2ReferenceGapEv: gap,
    signedObservedMos2GapDifferenceEv: input.observedQueryMos2GapEv - gap,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedMos2LayerCounts: [1, 2, 3],
  callerMeasuredMos2GapEv: [1.9, 1.5, 1.3],
  queryMos2LayerCount: 2,
  observedQueryMos2GapEv: 1.6,
} satisfies Input;
export const exampleOutput = {
  callerMos2ReferenceGapEv: 1.5,
  signedObservedMos2GapDifferenceEv: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/mos2-bandgap-layer-dependence",
  title: "Semiconductor Mos2 Bandgap Layer Dependence Calculator",
  description:
    "Audit actual discrete MoS2 layer-specific gap against independently matched observed reference, no fractional layer interpolation or generic direct/indirect branch comparison.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMos2ReferenceGapEv",
      label: "Caller mos2 reference gap ev",
      kind: "number",
    },
    {
      id: "signedObservedMos2GapDifferenceEv",
      label: "Signed observed mos2 gap difference ev",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedMos2LayerCounts:
        value.callerVerifiedMos2LayerCounts as readonly number[],
      callerMeasuredMos2GapEv:
        value.callerMeasuredMos2GapEv as readonly number[],
      queryMos2LayerCount: value.queryMos2LayerCount as number,
      observedQueryMos2GapEv: value.observedQueryMos2GapEv as number,
    }),
});
export const run = tool.execute;
export default tool;
