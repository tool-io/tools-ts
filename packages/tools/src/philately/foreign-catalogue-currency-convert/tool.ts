import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  roundMinor,
  positiveCounts,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly sourceValueMinor: number;
  readonly targetMinorPerSourceMinorNumerator: number;
  readonly targetMinorPerSourceMinorDenominator: number;
}>;
export type Output = Readonly<{ readonly targetValueMinor: number }>;
const inputFields = [
  { id: "sourceValueMinor", label: "Source value minor", kind: "number" },
  {
    id: "targetMinorPerSourceMinorNumerator",
    label: "Target minor per source minor numerator",
    kind: "number",
  },
  {
    id: "targetMinorPerSourceMinorDenominator",
    label: "Target minor per source minor denominator",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.sourceValueMinor, "source");
  positiveCounts([
    input.targetMinorPerSourceMinorNumerator,
    input.targetMinorPerSourceMinorDenominator,
  ]);
  return {
    targetValueMinor: roundMinor(
      BigInt(input.sourceValueMinor) *
        BigInt(input.targetMinorPerSourceMinorNumerator),
      BigInt(input.targetMinorPerSourceMinorDenominator),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sourceValueMinor: 10001,
  targetMinorPerSourceMinorNumerator: 3,
  targetMinorPerSourceMinorDenominator: 2,
} satisfies Input;
export const exampleOutput = { targetValueMinor: 15002 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/foreign-catalogue-currency-convert",
  title: "Currency Exchange Convert for Foreign Catalogue Values",
  description:
    "Convert explicit source minor units to target minor units using a caller verified rational minor-unit rate; no FX feed or equal decimal-scale assumption. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "targetValueMinor", label: "Target value minor", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sourceValueMinor: value.sourceValueMinor as number,
      targetMinorPerSourceMinorNumerator:
        value.targetMinorPerSourceMinorNumerator as number,
      targetMinorPerSourceMinorDenominator:
        value.targetMinorPerSourceMinorDenominator as number,
    }),
});
export const run = tool.execute;
export default tool;
