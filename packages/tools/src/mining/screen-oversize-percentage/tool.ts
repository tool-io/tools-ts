import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedOversizeSieveClassSizesMm: readonly number[];
  readonly observedOversizeClassDryTonnes: readonly number[];
  readonly callerOversizeCutMm: number;
}>;
export type Output = Readonly<{
  readonly observedSelectedSieveMassFraction: number;
  readonly boundarySizeMassFraction: number;
}>;
const inputFields = [
  {
    id: "observedOversizeSieveClassSizesMm",
    label: "Observed oversize sieve class sizes mm",
    kind: "numberList",
  },
  {
    id: "observedOversizeClassDryTonnes",
    label: "Observed oversize class dry tonnes",
    kind: "numberList",
  },
  {
    id: "callerOversizeCutMm",
    label: "Caller oversize cut mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOversizeSieveClassSizesMm.forEach((v) =>
    positive(v, "observedOversizeSieveClassSizesMm"),
  );
  positive(input.callerOversizeCutMm, "callerOversizeCutMm");
  input.observedOversizeClassDryTonnes.forEach((v) =>
    nonnegative(v, "observedOversizeClassDryTonnes"),
  );
  aligned(
    input.observedOversizeSieveClassSizesMm,
    input.observedOversizeClassDryTonnes,
    "observedOversizeSieveClassSizesMm",
  );
  const total = sum(input.observedOversizeClassDryTonnes);
  positive(total, "total sieve mass");
  return {
    observedSelectedSieveMassFraction:
      sum(
        input.observedOversizeClassDryTonnes.filter(
          (_, i) =>
            input.observedOversizeSieveClassSizesMm[i] >
            input.callerOversizeCutMm,
        ),
      ) / total,
    boundarySizeMassFraction:
      sum(
        input.observedOversizeClassDryTonnes.filter(
          (_, i) =>
            input.observedOversizeSieveClassSizesMm[i] ===
            input.callerOversizeCutMm,
        ),
      ) / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOversizeSieveClassSizesMm: [1, 2, 3],
  observedOversizeClassDryTonnes: [2, 3, 5],
  callerOversizeCutMm: 2,
} satisfies Input;
export const exampleOutput = {
  observedSelectedSieveMassFraction: 0.5,
  boundarySizeMassFraction: 0.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/screen-oversize-percentage",
  title: "Screen Oversize Percentage Calculator",
  description:
    "Audit actual oversize sieve-class dry mass with explicit strict size inequality and boundary mass separate, not inferred screen recovery or complementary classification without tie convention. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSelectedSieveMassFraction",
      label: "Observed selected sieve mass fraction",
      kind: "number",
    },
    {
      id: "boundarySizeMassFraction",
      label: "Boundary size mass fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOversizeSieveClassSizesMm:
        value.observedOversizeSieveClassSizesMm as readonly number[],
      observedOversizeClassDryTonnes:
        value.observedOversizeClassDryTonnes as readonly number[],
      callerOversizeCutMm: value.callerOversizeCutMm as number,
    }),
});
export const run = tool.execute;
export default tool;
