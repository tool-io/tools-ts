import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualValues: readonly string[];
  readonly actualStartIndex: number;
  readonly actualEndIndexExclusive: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualValues", label: "Actual values", kind: "stringList" },
  { id: "actualStartIndex", label: "Actual start index", kind: "number" },
  {
    id: "actualEndIndexExclusive",
    label: "Actual end index exclusive",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (
    !Number.isSafeInteger(input.actualStartIndex) ||
    !Number.isSafeInteger(input.actualEndIndexExclusive)
  )
    simpleError("indices", "Actualsafeintegers.");
  return {
    slicedValues: input.actualValues.slice(
      input.actualStartIndex,
      input.actualEndIndexExclusive,
    ),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualValues: ["a", "b", "c", "d"],
    actualStartIndex: 1,
    actualEndIndexExclusive: 3,
  },
  output: { result: { slicedValues: ["b", "c"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/slice",
  title: "List Slice Tool",
  description:
    "ExactJSslicezero-basedexclusiveend,negativeindicesfromend,clampingandempty slices,withoutmutation. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
