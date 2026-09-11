import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  nonnegative,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMatchedPretreatmentEggsPerGram: readonly number[];
  readonly independentlyMatchedPosttreatmentEggsPerGram: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMatchedPretreatmentEggsPerGram",
    label: "Independently matched pretreatment eggs per gram",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedPosttreatmentEggsPerGram",
    label: "Independently matched posttreatment eggs per gram",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyMatchedPretreatmentEggsPerGram,
    input.independentlyMatchedPosttreatmentEggsPerGram,
    "animals",
  );
  [
    input.independentlyMatchedPretreatmentEggsPerGram,
    input.independentlyMatchedPosttreatmentEggsPerGram,
  ].forEach((v) => v.forEach((x) => nonnegative(x, "EPG")));
  return {
    observedPooledFecalEggCountReductionPercent:
      100 *
      (1 -
        sum(input.independentlyMatchedPosttreatmentEggsPerGram) /
          positive(
            sum(input.independentlyMatchedPretreatmentEggsPerGram),
            "pretreatment",
          )),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMatchedPretreatmentEggsPerGram: [100, 200],
    independentlyMatchedPosttreatmentEggsPerGram: [10, 20],
  },
  output: { result: { observedPooledFecalEggCountReductionPercent: 90 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/fecal-egg-count-reduction-test",
  title: "Fecal Egg Count Reduction Test Calculator",
  description:
    "Explicit paired-group pooled mean FECR=100\u00d7(1\u2212postsum/presum), not mean of individual percentages, control-adjusted FECRT, resistance diagnosis or confidence interval. Species/parasite/count method, sampling interval and qualified interpretation external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
