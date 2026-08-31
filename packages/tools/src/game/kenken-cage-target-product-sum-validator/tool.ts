import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  sum,
  bounded,
} from "../shared.js";
export type Input = Readonly<{
  readonly cageValues: readonly number[];
  readonly callerGridOrder: number;
  readonly operation: string;
  readonly targetValue: number;
}>;
export type Output = Readonly<{
  readonly observedArithmeticResult: number;
  readonly cageTargetMatches: boolean;
}>;
const inputFields = [
  { id: "cageValues", label: "Cage values", kind: "numberList" },
  { id: "callerGridOrder", label: "Caller grid order", kind: "number" },
  { id: "operation", label: "Operation", kind: "string" },
  { id: "targetValue", label: "Target value", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.targetValue, "targetValue");
  bounded(input.callerGridOrder, "gridOrder", 1, 16);
  if (!input.cageValues.length || input.cageValues.length > 12)
    simpleError("cage", "Bounded nonempty observed cage required.");
  input.cageValues.forEach((v) =>
    bounded(v, "value", 1, input.callerGridOrder),
  );
  let result: number;
  switch (input.operation) {
    case "sum":
      result = sum(input.cageValues);
      break;
    case "product":
      result = count(
        input.cageValues.reduce((a, b) => a * b, 1),
        "product",
      );
      break;
    case "difference":
    case "quotient":
      if (input.cageValues.length !== 2)
        return simpleError(
          "cage",
          "Difference/quotient require exactly two cells.",
        );
      result =
        input.operation === "difference"
          ? Math.abs(input.cageValues[0] - input.cageValues[1])
          : Math.max(...input.cageValues) / Math.min(...input.cageValues);
      break;
    case "single":
      if (input.cageValues.length !== 1)
        return simpleError("cage", "Single-value cage needs one cell.");
      result = input.cageValues[0];
      break;
    default:
      return simpleError(
        "operation",
        "sum/product/difference/quotient/single operation required.",
      );
  }
  return {
    observedArithmeticResult: result,
    cageTargetMatches: result === input.targetValue,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cageValues: [3, 4],
  callerGridOrder: 6,
  operation: "product",
  targetValue: 12,
} satisfies Input;
export const exampleOutput = {
  observedArithmeticResult: 12,
  cageTargetMatches: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/kenken-cage-target-product-sum-validator",
  title: "KenKen Cage Target Product/Sum Validator",
  description:
    "Validate observed KenKen cage arithmetic with order-independent two-cell difference/quotient and exact bounded products; repeated values are not universally barred across different rows/columns. Latin-square constraints omitted.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedArithmeticResult",
      label: "Observed arithmetic result",
      kind: "number",
    },
    { id: "cageTargetMatches", label: "Cage target matches", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      cageValues: value.cageValues as readonly number[],
      callerGridOrder: value.callerGridOrder as number,
      operation: value.operation as string,
      targetValue: value.targetValue as number,
    }),
});
export const run = tool.execute;
export default tool;
