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
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedTopBackingLayerInterceptsMm: readonly number[];
  readonly sectionNormalToLayerAngleDegrees: number;
  readonly callerMinimumTopLayerFraction: number;
}>;
export type Output = Readonly<{
  readonly normalTopBackingLayerThicknessesMm: readonly number[];
  readonly topLayerFraction: number;
  readonly belowCallerTopLayerCriterion: boolean;
}>;
const inputFields = [
  {
    id: "observedTopBackingLayerInterceptsMm",
    label: "Observed top backing layer intercepts mm",
    kind: "numberList",
  },
  {
    id: "sectionNormalToLayerAngleDegrees",
    label: "Section normal to layer angle degrees",
    kind: "number",
  },
  {
    id: "callerMinimumTopLayerFraction",
    label: "Caller minimum top layer fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTopBackingLayerInterceptsMm.forEach((v) =>
    nonnegative(v, "observedTopBackingLayerInterceptsMm"),
  );
  fraction(
    input.callerMinimumTopLayerFraction,
    "callerMinimumTopLayerFraction",
  );
  if (
    input.observedTopBackingLayerInterceptsMm.length !== 2 ||
    Math.abs(input.sectionNormalToLayerAngleDegrees) >= 90
  )
    simpleError(
      "section",
      "Two top/backing intercepts and acute section-normal angle required.",
    );
  const t = input.observedTopBackingLayerInterceptsMm.map(
      (v) =>
        v * Math.cos((input.sectionNormalToLayerAngleDegrees * Math.PI) / 180),
    ),
    topLayerFraction = t[0] / positive(t[0] + t[1], "totalThickness");
  return {
    normalTopBackingLayerThicknessesMm: t,
    topLayerFraction,
    belowCallerTopLayerCriterion:
      topLayerFraction < input.callerMinimumTopLayerFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTopBackingLayerInterceptsMm: [1, 2],
  sectionNormalToLayerAngleDegrees: 60,
  callerMinimumTopLayerFraction: 0.4,
} satisfies Input;
export const exampleOutput = {
  normalTopBackingLayerThicknessesMm: [0.5, 1],
  topLayerFraction: 0.3333333333333333,
  belowCallerTopLayerCriterion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/opal-doublet-check",
  title: "Opal Doublet Thickness Check",
  description:
    "Correct caller microscopy top/backing intercepts for oblique section geometry and audit top fraction; two-layer geometry does not identify opal, treatment or adhesive condition.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalTopBackingLayerThicknessesMm",
      label: "Normal top backing layer thicknesses mm",
      kind: "numberList",
    },
    { id: "topLayerFraction", label: "Top layer fraction", kind: "number" },
    {
      id: "belowCallerTopLayerCriterion",
      label: "Below caller top layer criterion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTopBackingLayerInterceptsMm:
        value.observedTopBackingLayerInterceptsMm as readonly number[],
      sectionNormalToLayerAngleDegrees:
        value.sectionNormalToLayerAngleDegrees as number,
      callerMinimumTopLayerFraction:
        value.callerMinimumTopLayerFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
