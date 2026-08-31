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
  readonly verifiedLiftAnglesDegrees: readonly number[];
}>;
export type Output = Readonly<{ readonly matchedVerifiedValue: number }>;
const inputFields = [
  { id: "callerMovementIds", label: "Caller movement ids", kind: "stringList" },
  { id: "requestedMovementId", label: "Requested movement id", kind: "string" },
  {
    id: "verifiedLiftAnglesDegrees",
    label: "Verified lift angles degrees",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.verifiedLiftAnglesDegrees.forEach((v) => {
    positive(v, "angle");
    if (v > 90)
      simpleError(
        "angle",
        "Caller verified lift angle must lie in (0,90] degrees.",
      );
  });
  return {
    matchedVerifiedValue: lookup(
      input.callerMovementIds,
      input.verifiedLiftAnglesDegrees,
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
  verifiedLiftAnglesDegrees: [52, 50],
} satisfies Input;
export const exampleOutput = { matchedVerifiedValue: 52 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/lift-angle-lookup",
  title: "Lift Angle Lookup",
  description:
    "Read lift angle only from caller verified movement/reference catalog; no guessed make/model database or unsupported amplitude correction.",
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
      verifiedLiftAnglesDegrees:
        value.verifiedLiftAnglesDegrees as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
