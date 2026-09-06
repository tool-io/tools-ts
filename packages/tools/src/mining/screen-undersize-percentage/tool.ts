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
  readonly observedUndersizeSieveClassSizesMm: readonly number[];
  readonly observedUndersizeClassDryTonnes: readonly number[];
  readonly callerUndersizeCutMm: number;
}>;
export type Output = Readonly<{
  readonly observedSelectedSieveMassFraction: number;
  readonly boundarySizeMassFraction: number;
}>;
const inputFields = [
  {
    id: "observedUndersizeSieveClassSizesMm",
    label: "Observed undersize sieve class sizes mm",
    kind: "numberList",
  },
  {
    id: "observedUndersizeClassDryTonnes",
    label: "Observed undersize class dry tonnes",
    kind: "numberList",
  },
  {
    id: "callerUndersizeCutMm",
    label: "Caller undersize cut mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedUndersizeSieveClassSizesMm.forEach((v) =>
    positive(v, "observedUndersizeSieveClassSizesMm"),
  );
  positive(input.callerUndersizeCutMm, "callerUndersizeCutMm");
  input.observedUndersizeClassDryTonnes.forEach((v) =>
    nonnegative(v, "observedUndersizeClassDryTonnes"),
  );
  aligned(
    input.observedUndersizeSieveClassSizesMm,
    input.observedUndersizeClassDryTonnes,
    "observedUndersizeSieveClassSizesMm",
  );
  const total = sum(input.observedUndersizeClassDryTonnes);
  positive(total, "total sieve mass");
  return {
    observedSelectedSieveMassFraction:
      sum(
        input.observedUndersizeClassDryTonnes.filter(
          (_, i) =>
            input.observedUndersizeSieveClassSizesMm[i] <
            input.callerUndersizeCutMm,
        ),
      ) / total,
    boundarySizeMassFraction:
      sum(
        input.observedUndersizeClassDryTonnes.filter(
          (_, i) =>
            input.observedUndersizeSieveClassSizesMm[i] ===
            input.callerUndersizeCutMm,
        ),
      ) / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUndersizeSieveClassSizesMm: [1, 2, 3],
  observedUndersizeClassDryTonnes: [2, 3, 5],
  callerUndersizeCutMm: 2,
} satisfies Input;
export const exampleOutput = {
  observedSelectedSieveMassFraction: 0.2,
  boundarySizeMassFraction: 0.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/screen-undersize-percentage",
  title: "Screen Undersize Percentage Calculator",
  description:
    "Audit actual undersize sieve-class dry mass with explicit strict size inequality and boundary mass separate, not inferred screen recovery or complementary classification without tie convention. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedUndersizeSieveClassSizesMm:
        value.observedUndersizeSieveClassSizesMm as readonly number[],
      observedUndersizeClassDryTonnes:
        value.observedUndersizeClassDryTonnes as readonly number[],
      callerUndersizeCutMm: value.callerUndersizeCutMm as number,
    }),
});
export const run = tool.execute;
export default tool;
