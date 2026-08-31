import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, lookup } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly callerMovementIds: readonly string[];
  readonly requestedMovementId: string;
  readonly verifiedEscapeWheelToothCounts: readonly number[];
}>;
export type Output = Readonly<{ readonly matchedVerifiedValue: number }>;
const inputFields = [
  { id: "callerMovementIds", label: "Caller movement ids", kind: "stringList" },
  { id: "requestedMovementId", label: "Requested movement id", kind: "string" },
  {
    id: "verifiedEscapeWheelToothCounts",
    label: "Verified escape wheel tooth counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.verifiedEscapeWheelToothCounts.forEach((v) =>
    bounded(v, "spec", 1, 1000),
  );
  return {
    matchedVerifiedValue: lookup(
      input.callerMovementIds,
      input.verifiedEscapeWheelToothCounts,
      input.requestedMovementId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMovementIds: ["A", "B"],
  requestedMovementId: "A",
  verifiedEscapeWheelToothCounts: [15, 20],
} satisfies Input;
export const exampleOutput = { matchedVerifiedValue: 15 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/escape-wheel-tooth-count",
  title: "Escapement Wheel Tooth Count Lookup",
  description:
    "Read exact caller verified escapement-wheel tooth count, not assuming every lever/anchor shares geometry or inferring it from beat rate.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedVerifiedValue",
      label: "Matched verified value",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMovementIds: value.callerMovementIds as readonly string[],
      requestedMovementId: value.requestedMovementId as string,
      verifiedEscapeWheelToothCounts:
        value.verifiedEscapeWheelToothCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
