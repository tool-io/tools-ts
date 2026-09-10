import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualStalagmiteHeightMm: number;
  readonly callerIndependentAverageStalagmiteGrowthMmPerYear: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualStalagmiteHeightMm",
    label: "Actual stalagmite height mm",
    kind: "number",
  },
  {
    id: "callerIndependentAverageStalagmiteGrowthMmPerYear",
    label: "Caller independent average stalagmite growth mm per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualStalagmiteHeightMm, "numerator");
  positive(
    input.callerIndependentAverageStalagmiteGrowthMmPerYear,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.actualStalagmiteHeightMm) /
      input.callerIndependentAverageStalagmiteGrowthMmPerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualStalagmiteHeightMm: 2,
    callerIndependentAverageStalagmiteGrowthMmPerYear: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/stalagmite-height-age",
  title: "Stalagmite Height to Age Rough Estimate Calculator",
  description:
    "Conditional stalagmite height/independently validated mean growthrate age, not actual speleothem isotopic chronology or universal constant growth. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
