import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  unique,
  finite,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyJustifiedFactorIds: readonly string[];
  readonly callerIndependentlyJustifiedFactors: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyJustifiedFactorIds",
    label: "Caller independently justified factor ids",
    kind: "stringList",
  },
  {
    id: "callerIndependentlyJustifiedFactors",
    label: "Caller independently justified factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerIndependentlyJustifiedFactorIds, "factors");
  aligned(
    input.callerIndependentlyJustifiedFactorIds,
    input.callerIndependentlyJustifiedFactors,
    "factors",
  );
  input.callerIndependentlyJustifiedFactors.forEach((v) => {
    if (v < 1)
      simpleError("factors", "Independently justified uncertainty factor≥1.");
  });
  return {
    conditionalCompositeUncertaintyFactor:
      input.callerIndependentlyJustifiedFactors.reduce(
        (a, b) => finite(a * b),
        1,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyJustifiedFactorIds: ["interspecies", "intraspecies"],
    callerIndependentlyJustifiedFactors: [10, 3],
  },
  output: { result: { conditionalCompositeUncertaintyFactor: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/uncertainty-factor-composite",
  title: "Composite Uncertainty Factor Calculator",
  description:
    "Product of actual independently justified named uncertainty factors, not default10-per-factor or doublecount overlapping evidence. Does not derive a safe dose, choose factors or establish authoritative assessment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
