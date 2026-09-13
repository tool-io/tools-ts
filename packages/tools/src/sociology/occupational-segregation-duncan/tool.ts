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
  readonly actualFirstGroupCountsByUnit: readonly number[];
  readonly actualSecondGroupCountsByUnit: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFirstGroupCountsByUnit",
    label: "Actual first group counts by unit",
    kind: "numberList",
  },
  {
    id: "actualSecondGroupCountsByUnit",
    label: "Actual second group counts by unit",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualFirstGroupCountsByUnit,
    input.actualSecondGroupCountsByUnit,
    "units",
  );
  [
    ...input.actualFirstGroupCountsByUnit,
    ...input.actualSecondGroupCountsByUnit,
  ].forEach((v) => bounded(v, "count", 0, 1000000));
  const x = positive(sum(input.actualFirstGroupCountsByUnit), "groupX"),
    y = positive(sum(input.actualSecondGroupCountsByUnit), "groupY");
  return {
    observedDissimilarity:
      0.5 *
      sum(
        input.actualFirstGroupCountsByUnit.map((v, i) =>
          Math.abs(v / x - input.actualSecondGroupCountsByUnit[i] / y),
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFirstGroupCountsByUnit: [8, 2],
    actualSecondGroupCountsByUnit: [2, 8],
  },
  output: { result: { observedDissimilarity: 0.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/occupational-segregation-duncan",
  title: "Duncan Segregation Index Calculator",
  description:
    "Observed occupation-unitDuncan dissimilarity from independently assigned aggregate two group counts, not the Duncan SEI or individual identity/group membership prediction.",
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
