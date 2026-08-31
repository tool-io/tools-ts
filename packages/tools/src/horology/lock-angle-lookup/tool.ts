import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, lookup } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly callerMovementIds: readonly string[];
  readonly requestedMovementId: string;
  readonly verifiedLockAnglesDegrees: readonly number[];
}>;
export type Output = Readonly<{ readonly matchedVerifiedValue: number }>;
const inputFields = [
  { id: "callerMovementIds", label: "Caller movement ids", kind: "stringList" },
  { id: "requestedMovementId", label: "Requested movement id", kind: "string" },
  {
    id: "verifiedLockAnglesDegrees",
    label: "Verified lock angles degrees",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.verifiedLockAnglesDegrees.forEach((v) => {
    positive(v, "angle");
    if (v > 45)
      simpleError(
        "angle",
        "Caller verified lock angle must lie in (0,45] degrees.",
      );
  });
  return {
    matchedVerifiedValue: lookup(
      input.callerMovementIds,
      input.verifiedLockAnglesDegrees,
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
  verifiedLockAnglesDegrees: [2, 3],
} satisfies Input;
export const exampleOutput = { matchedVerifiedValue: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/lock-angle-lookup",
  title: "Escapement Lock Angle Lookup",
  description:
    "Read caller verified escapement lock-angle specifications by exact movement identifier; not deriving lock from lift or claiming a universal servicing setting.",
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
      verifiedLockAnglesDegrees:
        value.verifiedLockAnglesDegrees as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
