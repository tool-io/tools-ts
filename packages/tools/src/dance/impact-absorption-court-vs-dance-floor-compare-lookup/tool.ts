import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredCourtImpactPeakNewtons: readonly number[];
  readonly independentlyMatchedDanceFloorImpactPeakNewtons: readonly number[];
}>;
export type Output = Readonly<{
  readonly pairedDanceMinusCourtPeakNewtons: readonly number[];
  readonly pooledDanceOverCourtPeakRatio: number;
}>;
const inputFields = [
  {
    id: "independentlyMeasuredCourtImpactPeakNewtons",
    label: "Independently measured court impact peak newtons",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedDanceFloorImpactPeakNewtons",
    label: "Independently matched dance floor impact peak newtons",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.independentlyMeasuredCourtImpactPeakNewtons.forEach((v) =>
    positive(v, "independentlyMeasuredCourtImpactPeakNewtons"),
  );
  input.independentlyMatchedDanceFloorImpactPeakNewtons.forEach((v) =>
    nonnegative(v, "independentlyMatchedDanceFloorImpactPeakNewtons"),
  );
  aligned(
    input.independentlyMeasuredCourtImpactPeakNewtons,
    input.independentlyMatchedDanceFloorImpactPeakNewtons,
    "independentlyMeasuredCourtImpactPeakNewtons",
  );
  return {
    pairedDanceMinusCourtPeakNewtons:
      input.independentlyMatchedDanceFloorImpactPeakNewtons.map(
        (v, i) => v - input.independentlyMeasuredCourtImpactPeakNewtons[i],
      ),
    pooledDanceOverCourtPeakRatio:
      sum(input.independentlyMatchedDanceFloorImpactPeakNewtons) /
      sum(input.independentlyMeasuredCourtImpactPeakNewtons),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyMeasuredCourtImpactPeakNewtons: [100, 120],
  independentlyMatchedDanceFloorImpactPeakNewtons: [80, 100],
} satisfies Input;
export const exampleOutput = {
  pairedDanceMinusCourtPeakNewtons: [-20, -20],
  pooledDanceOverCourtPeakRatio: 0.8181818181818182,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/impact-absorption-court-vs-dance-floor-compare-lookup",
  title: "Impact Absorption Court vs Dance Floor Compare Lookup",
  description:
    "Matched same-protocol instrumented impact force comparison, distinct from static floor load/deflection and no injury or compliance inference. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "pairedDanceMinusCourtPeakNewtons",
      label: "Paired dance minus court peak newtons",
      kind: "numberList",
    },
    {
      id: "pooledDanceOverCourtPeakRatio",
      label: "Pooled dance over court peak ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyMeasuredCourtImpactPeakNewtons:
        value.independentlyMeasuredCourtImpactPeakNewtons as readonly number[],
      independentlyMatchedDanceFloorImpactPeakNewtons:
        value.independentlyMatchedDanceFloorImpactPeakNewtons as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
