import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerMethodPairKeys: readonly string[];
  readonly callerVerifiedSourcePositionIds: readonly string[];
  readonly callerVerifiedTargetPositionIds: readonly string[];
  readonly queryMethodPairKey: string;
  readonly querySourcePositionId: string;
}>;
export type Output = Readonly<{
  readonly matchedCallerTargetPositionIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerMethodPairKeys",
    label: "Caller method pair keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSourcePositionIds",
    label: "Caller verified source position ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTargetPositionIds",
    label: "Caller verified target position ids",
    kind: "stringList",
  },
  { id: "queryMethodPairKey", label: "Query method pair key", kind: "string" },
  {
    id: "querySourcePositionId",
    label: "Query source position id",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerMethodPairKeys,
    input.callerVerifiedSourcePositionIds,
    "callerMethodPairKeys",
  );
  aligned(
    input.callerMethodPairKeys,
    input.callerVerifiedTargetPositionIds,
    "callerMethodPairKeys",
  );
  return {
    matchedCallerTargetPositionIds: [
      ...new Set(
        input.callerVerifiedTargetPositionIds.filter(
          (_, i) =>
            input.callerMethodPairKeys[i] === input.queryMethodPairKey &&
            input.callerVerifiedSourcePositionIds[i] ===
              input.querySourcePositionId,
        ),
      ),
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMethodPairKeys: ["cecchetti/rad", "vaganova/rad"],
  callerVerifiedSourcePositionIds: ["source-a", "source-b"],
  callerVerifiedTargetPositionIds: ["target-a", "target-b"],
  queryMethodPairKey: "vaganova/rad",
  querySourcePositionId: "source-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerTargetPositionIds: ["target-b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/cecchetti-vaganova-rad-method-crossref-lookup",
  title: "Cecchetti Vaganova Rad Method Crossref Lookup",
  description:
    "Exact caller verified Cecchetti/Vaganova/RAD position crosswalk; retains multiple or absent equivalences, not universal method-number conversion. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerTargetPositionIds",
      label: "Matched caller target position ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMethodPairKeys: value.callerMethodPairKeys as readonly string[],
      callerVerifiedSourcePositionIds:
        value.callerVerifiedSourcePositionIds as readonly string[],
      callerVerifiedTargetPositionIds:
        value.callerVerifiedTargetPositionIds as readonly string[],
      queryMethodPairKey: value.queryMethodPairKey as string,
      querySourcePositionId: value.querySourcePositionId as string,
    }),
});
export const run = tool.execute;
export default tool;
