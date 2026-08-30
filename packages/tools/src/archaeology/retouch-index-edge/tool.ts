import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedEdgeSegmentLengthsMm: readonly number[];
  readonly retouchedSegmentFractions: readonly number[];
  readonly unobservableEdgeLengthMm: number;
}>;
export type Output = Readonly<{
  readonly retouchedObservedEdgeLengthMm: number;
  readonly observedEdgeRetouchIndex: number;
  readonly totalEdgeRetouchFractionBounds: readonly number[];
}>;
const inputFields = [
  {
    id: "observedEdgeSegmentLengthsMm",
    label: "Observed edge segment lengths mm",
    kind: "numberList",
  },
  {
    id: "retouchedSegmentFractions",
    label: "Retouched segment fractions",
    kind: "numberList",
  },
  {
    id: "unobservableEdgeLengthMm",
    label: "Unobservable edge length mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedEdgeSegmentLengthsMm.forEach((v) =>
    positive(v, "observedEdgeSegmentLengthsMm"),
  );
  nonnegative(input.unobservableEdgeLengthMm, "unobservableEdgeLengthMm");
  input.retouchedSegmentFractions.forEach((v) =>
    fraction(v, "retouchedSegmentFractions"),
  );
  aligned(
    input.observedEdgeSegmentLengthsMm,
    input.retouchedSegmentFractions,
    "observedEdgeSegmentLengthsMm",
  );
  const observed = input.observedEdgeSegmentLengthsMm.reduce(
      (a, b) => a + b,
      0,
    ),
    retouchedObservedEdgeLengthMm = input.observedEdgeSegmentLengthsMm.reduce(
      (s, v, i) => s + v * input.retouchedSegmentFractions[i],
      0,
    ),
    total = observed + input.unobservableEdgeLengthMm;
  return {
    retouchedObservedEdgeLengthMm,
    observedEdgeRetouchIndex: retouchedObservedEdgeLengthMm / observed,
    totalEdgeRetouchFractionBounds: [
      retouchedObservedEdgeLengthMm / total,
      (retouchedObservedEdgeLengthMm + input.unobservableEdgeLengthMm) / total,
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEdgeSegmentLengthsMm: [10, 20],
  retouchedSegmentFractions: [1, 0.5],
  unobservableEdgeLengthMm: 10,
} satisfies Input;
export const exampleOutput = {
  retouchedObservedEdgeLengthMm: 20,
  observedEdgeRetouchIndex: 0.6666666666666666,
  totalEdgeRetouchFractionBounds: [0.5, 0.75],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/retouch-index-edge",
  title: "Edge Retouch Index",
  description:
    "Compute observed linear edge retouch coverage and extreme bounds for missing edge; not scar-depth intensity or a manufacturing/usage diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "retouchedObservedEdgeLengthMm",
      label: "Retouched observed edge length mm",
      kind: "number",
    },
    {
      id: "observedEdgeRetouchIndex",
      label: "Observed edge retouch index",
      kind: "number",
    },
    {
      id: "totalEdgeRetouchFractionBounds",
      label: "Total edge retouch fraction bounds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEdgeSegmentLengthsMm:
        value.observedEdgeSegmentLengthsMm as readonly number[],
      retouchedSegmentFractions:
        value.retouchedSegmentFractions as readonly number[],
      unobservableEdgeLengthMm: value.unobservableEdgeLengthMm as number,
    }),
});
export const run = tool.execute;
export default tool;
