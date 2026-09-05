import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, aligned } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly annotatedFieldStageOrdinals: readonly number[];
  readonly callerExpectedStageOrdinals: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "annotatedFieldStageOrdinals",
    label: "Annotated field stage ordinals",
    kind: "numberList",
  },
  {
    id: "callerExpectedStageOrdinals",
    label: "Caller expected stage ordinals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.annotatedFieldStageOrdinals,
    input.callerExpectedStageOrdinals,
    "stages",
  );
  input.annotatedFieldStageOrdinals.forEach((v) => bounded(v, "stage", 0, 16));
  input.callerExpectedStageOrdinals.forEach((v) => bounded(v, "stage", 0, 16));
  const k = input.annotatedFieldStageOrdinals.findIndex(
    (v, i) => v !== input.callerExpectedStageOrdinals[i],
  );
  return { matchesCallerOrder: k < 0, firstOrderMismatchIndex: k };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    annotatedFieldStageOrdinals: [0, 1, 2, 3],
    callerExpectedStageOrdinals: [0, 1, 2, 3],
  },
  output: { result: { matchesCallerOrder: true, firstOrderMismatchIndex: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/blazon-word-order-validator",
  title: "Blazon Word Order Validator (English convention)",
  description:
    "Audit caller independently annotated blazon stage order against explicit English-convention edition order; not an unrestricted natural-language grammar parser.",
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
