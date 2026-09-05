import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly completeUnitsPerRow: readonly number[];
  readonly partialUnitsPerRow: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "completeUnitsPerRow",
    label: "Complete units per row",
    kind: "numberList",
  },
  {
    id: "partialUnitsPerRow",
    label: "Partial units per row",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.completeUnitsPerRow.forEach((v) =>
    nonnegative(v, "completeUnitsPerRow"),
  );
  input.partialUnitsPerRow.forEach((v) => nonnegative(v, "partialUnitsPerRow"));
  aligned(
    input.completeUnitsPerRow,
    input.partialUnitsPerRow,
    "completeUnitsPerRow",
  );
  [...input.completeUnitsPerRow, ...input.partialUnitsPerRow].forEach((v) =>
    integer(v, "units"),
  );
  return {
    completeUnitCount: sum(input.completeUnitsPerRow),
    partialUnitCount: sum(input.partialUnitsPerRow),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { completeUnitsPerRow: [4, 3, 4], partialUnitsPerRow: [0, 1, 0] },
  output: { result: { completeUnitCount: 11, partialUnitCount: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/vair-bell-unit-counter",
  title: "Vair Bell Pattern Unit Counter",
  description:
    "Count independently annotated VairBellunits by rows; retain partial edge units separately, no assumed complete rectangular tiling.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
