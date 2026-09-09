import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  positive,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualCompleteNormativeMineralAmounts: readonly number[];
  readonly independentlySelectedComponentFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCompleteNormativeMineralAmounts",
    label: "Actual complete normative mineral amounts",
    kind: "numberList",
  },
  {
    id: "independentlySelectedComponentFlags",
    label: "Independently selected component flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualCompleteNormativeMineralAmounts,
    input.independentlySelectedComponentFlags,
    "norm",
  );
  binary(input.independentlySelectedComponentFlags, "components");
  input.actualCompleteNormativeMineralAmounts.forEach((v) =>
    nonnegative(v, "normamount"),
  );
  return {
    observedSelectedNormativePercent:
      (100 *
        sum(
          input.actualCompleteNormativeMineralAmounts.map(
            (v, i) => v * input.independentlySelectedComponentFlags[i],
          ),
        )) /
      positive(
        sum(input.actualCompleteNormativeMineralAmounts),
        "completenorm",
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCompleteNormativeMineralAmounts: [2, 3, 5],
    independentlySelectedComponentFlags: [1, 0, 1],
  },
  output: { result: { observedSelectedNormativePercent: 70 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/normative-color-index",
  title: "Geology Normative Color Index Calculator",
  description:
    "Actual independently selected mafic normative mineral color-index percentage of complete same-basis independently computed norm. Weight/volume basis and mineral assignment external, not compute full CIPWnorm or actual observed mineral mode.",
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
