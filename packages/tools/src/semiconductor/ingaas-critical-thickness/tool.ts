import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTestedLayerThicknessNm: readonly number[];
  readonly observedRelaxationFractions: readonly number[];
  readonly callerRelaxationOnsetFraction: number;
}>;
export type Output = Readonly<{
  readonly measuredCriticalThicknessCrossingsNm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTestedLayerThicknessNm",
    label: "Observed tested layer thickness nm",
    kind: "numberList",
  },
  {
    id: "observedRelaxationFractions",
    label: "Observed relaxation fractions",
    kind: "numberList",
  },
  {
    id: "callerRelaxationOnsetFraction",
    label: "Caller relaxation onset fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTestedLayerThicknessNm.forEach((v) =>
    positive(v, "observedTestedLayerThicknessNm"),
  );
  input.observedRelaxationFractions.forEach((v) =>
    fraction(v, "observedRelaxationFractions"),
  );
  fraction(
    input.callerRelaxationOnsetFraction,
    "callerRelaxationOnsetFraction",
  );
  return {
    measuredCriticalThicknessCrossingsNm: crossings(
      input.observedTestedLayerThicknessNm,
      input.observedRelaxationFractions,
      input.callerRelaxationOnsetFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTestedLayerThicknessNm: [10, 20, 30],
  observedRelaxationFractions: [0, 0.1, 0.5],
  callerRelaxationOnsetFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  measuredCriticalThicknessCrossingsNm: [22.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/ingaas-critical-thickness",
  title: "Semiconductor InGaAs Critical Thickness Calculator",
  description:
    "Extract actual InGaAs relaxation-onset thickness crossings from independent matched strain/stack trials, not existing Matthews–Blakeslee force-balance root or universal mismatch estimate.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredCriticalThicknessCrossingsNm",
      label: "Measured critical thickness crossings nm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTestedLayerThicknessNm:
        value.observedTestedLayerThicknessNm as readonly number[],
      observedRelaxationFractions:
        value.observedRelaxationFractions as readonly number[],
      callerRelaxationOnsetFraction:
        value.callerRelaxationOnsetFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
