import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  sum,
  aligned,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFirstGroupCountsByArea: readonly number[];
  readonly actualSecondGroupCountsByArea: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFirstGroupCountsByArea",
    label: "Actual first group counts by area",
    kind: "numberList",
  },
  {
    id: "actualSecondGroupCountsByArea",
    label: "Actual second group counts by area",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualFirstGroupCountsByArea,
    input.actualSecondGroupCountsByArea,
    "areas",
  );
  [
    ...input.actualFirstGroupCountsByArea,
    ...input.actualSecondGroupCountsByArea,
  ].forEach((v) => bounded(v, "counts", 0, 1000000));
  const x = positive(sum(input.actualFirstGroupCountsByArea), "firstgroup");
  return {
    observedIndex: sum(
      input.actualFirstGroupCountsByArea.map((v, i) => {
        const t = positive(
          v + input.actualSecondGroupCountsByArea[i],
          "areapopulation",
        );
        return ((v / x) * v) / t;
      }),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFirstGroupCountsByArea: [8, 2],
    actualSecondGroupCountsByArea: [2, 8],
  },
  output: { result: { observedIndex: 0.68 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/segregation-isolation-index",
  title: "Isolation Segregation Index Calculator",
  description:
    "Actual area weighted first group isolation own-groups hare index\u03a3(xi/X)*(yi/ti) or(xi/ti), actual complete exclusive counts. No personal membership or social effect inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
