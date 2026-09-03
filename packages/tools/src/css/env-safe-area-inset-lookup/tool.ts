import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerObservedSafeAreaInsetsPx: readonly number[];
  readonly callerDesiredPaddingPx: readonly number[];
}>;
export type Output = Readonly<{
  readonly maxInsetOrPaddingPx: readonly number[];
}>;
const inputFields = [
  {
    id: "callerObservedSafeAreaInsetsPx",
    label: "Caller observed safe area insets px",
    kind: "numberList",
  },
  {
    id: "callerDesiredPaddingPx",
    label: "Caller desired padding px",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerObservedSafeAreaInsetsPx.forEach((v) =>
    nonnegative(v, "callerObservedSafeAreaInsetsPx"),
  );
  input.callerDesiredPaddingPx.forEach((v) =>
    nonnegative(v, "callerDesiredPaddingPx"),
  );
  if (
    input.callerObservedSafeAreaInsetsPx.length !== 4 ||
    input.callerDesiredPaddingPx.length !== 4
  )
    simpleError("sides", "Explicit top/right/bottom/left insets and padding.");
  return {
    maxInsetOrPaddingPx: input.callerObservedSafeAreaInsetsPx.map((v, i) =>
      Math.max(v, input.callerDesiredPaddingPx[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedSafeAreaInsetsPx: [10, 0, 20, 0],
  callerDesiredPaddingPx: [5, 5, 5, 5],
} satisfies Input;
export const exampleOutput = {
  maxInsetOrPaddingPx: [10, 5, 20, 5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/env-safe-area-inset-lookup",
  title: "env(safe-area-inset) Values Lookup",
  description:
    "Use supplied env safe-area top/right/bottom/left values in max(inset, padding), not read browser/device environment or add inset twice. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "maxInsetOrPaddingPx",
      label: "Max inset or padding px",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedSafeAreaInsetsPx:
        value.callerObservedSafeAreaInsetsPx as readonly number[],
      callerDesiredPaddingPx: value.callerDesiredPaddingPx as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
