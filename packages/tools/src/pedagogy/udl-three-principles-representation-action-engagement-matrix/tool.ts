import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerSupportIds: readonly string[];
  readonly callerAnnotatedUdlPrinciples: readonly string[];
  readonly knownSupportImplementationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownImplementedCountsByPrinciple: readonly number[];
  readonly unverifiedSupportIds: readonly string[];
}>;
const inputFields = [
  { id: "callerSupportIds", label: "Caller support ids", kind: "stringList" },
  {
    id: "callerAnnotatedUdlPrinciples",
    label: "Caller annotated udl principles",
    kind: "stringList",
  },
  {
    id: "knownSupportImplementationFlags",
    label: "Known support implementation flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownSupportImplementationFlags,
    "knownSupportImplementationFlags",
  );
  aligned(
    input.callerSupportIds,
    input.callerAnnotatedUdlPrinciples,
    "callerSupportIds",
  );
  aligned(
    input.callerSupportIds,
    input.knownSupportImplementationFlags,
    "callerSupportIds",
  );
  unique(input.callerSupportIds, "support ids");
  const principles = ["representation", "action-expression", "engagement"];
  input.callerAnnotatedUdlPrinciples.forEach((v) => {
    if (!principles.includes(v))
      simpleError("principle", "Explicit supportedUDLprinciple.");
  });
  return {
    knownImplementedCountsByPrinciple: principles.map((p) =>
      sum(
        input.callerAnnotatedUdlPrinciples.map((v, i) =>
          v === p ? input.knownSupportImplementationFlags[i] : 0,
        ),
      ),
    ),
    unverifiedSupportIds: input.callerSupportIds.filter(
      (_, i) => !input.knownSupportImplementationFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSupportIds: ["a", "b", "c"],
  callerAnnotatedUdlPrinciples: [
    "representation",
    "action-expression",
    "engagement",
  ],
  knownSupportImplementationFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  knownImplementedCountsByPrinciple: [1, 0, 1],
  unverifiedSupportIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/udl-three-principles-representation-action-engagement-matrix",
  title: "UDL Three Principles Representation Action Engagement Matrix",
  description:
    "UDL representation/action-expression/engagement actual support matrix count with unknown implementation, not accessibility, learner need or efficacy certification. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownImplementedCountsByPrinciple",
      label: "Known implemented counts by principle",
      kind: "numberList",
    },
    {
      id: "unverifiedSupportIds",
      label: "Unverified support ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSupportIds: value.callerSupportIds as readonly string[],
      callerAnnotatedUdlPrinciples:
        value.callerAnnotatedUdlPrinciples as readonly string[],
      knownSupportImplementationFlags:
        value.knownSupportImplementationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
