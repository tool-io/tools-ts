import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, minimum } from "../shared.js";

export type Input = Readonly<{
  readonly previousObservedExtremesC: readonly number[];
  readonly newObservedExtremeC: number;
}>;
export type Output = Readonly<{
  readonly previousRecordC: number;
  readonly signedNewRecordMarginC: number;
  readonly isStrictNewRecord: boolean;
}>;
const inputFields = [
  {
    id: "previousObservedExtremesC",
    label: "Previous observed extremes c",
    kind: "numberList",
  },
  {
    id: "newObservedExtremeC",
    label: "New observed extreme c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const previousRecordC = minimum(input.previousObservedExtremesC),
    signedNewRecordMarginC = previousRecordC - input.newObservedExtremeC;
  return {
    previousRecordC,
    signedNewRecordMarginC,
    isStrictNewRecord: signedNewRecordMarginC > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  previousObservedExtremesC: [10, 15],
  newObservedExtremeC: 9,
} satisfies Input;
export const exampleOutput = {
  previousRecordC: 10,
  signedNewRecordMarginC: 1,
  isStrictNewRecord: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/record-low-margin",
  title: "Record Low Margin Under Previous",
  description:
    "Compare new observed low with all previous eligible extrema, retaining signed margin and strict record equality semantics; exposure/record homogeneity must be caller established.",
  inputs: inputFields,
  outputs: [
    { id: "previousRecordC", label: "Previous record c", kind: "number" },
    {
      id: "signedNewRecordMarginC",
      label: "Signed new record margin c",
      kind: "number",
    },
    { id: "isStrictNewRecord", label: "Is strict new record", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      previousObservedExtremesC:
        value.previousObservedExtremesC as readonly number[],
      newObservedExtremeC: value.newObservedExtremeC as number,
    }),
});
export const run = tool.execute;
export default tool;
