import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  pick,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerClaimIds: readonly string[];
  readonly callerClaimTexts: readonly string[];
  readonly independentlyAnnotatedKnowledgeStates: readonly string[];
}>;
export type Output = Readonly<{
  readonly knownClaimTexts: readonly string[];
  readonly unknownClaimTexts: readonly string[];
  readonly disputedClaimTexts: readonly string[];
}>;
const inputFields = [
  { id: "callerClaimIds", label: "Caller claim ids", kind: "stringList" },
  { id: "callerClaimTexts", label: "Caller claim texts", kind: "stringList" },
  {
    id: "independentlyAnnotatedKnowledgeStates",
    label: "Independently annotated knowledge states",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.callerClaimIds, input.callerClaimTexts, "callerClaimIds");
  aligned(
    input.callerClaimIds,
    input.independentlyAnnotatedKnowledgeStates,
    "callerClaimIds",
  );
  unique(input.callerClaimIds, "claimids");
  input.independentlyAnnotatedKnowledgeStates.forEach((v) =>
    pick(v, { known: 0, unknown: 1, disputed: 2 }, "state"),
  );
  const get = (s: string) =>
    input.callerClaimTexts.filter(
      (_, i) => input.independentlyAnnotatedKnowledgeStates[i] === s,
    );
  return {
    knownClaimTexts: get("known"),
    unknownClaimTexts: get("unknown"),
    disputedClaimTexts: get("disputed"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerClaimIds: ["a", "b", "c"],
  callerClaimTexts: [
    "confirmed record",
    "pending confirmation",
    "disputed accounts",
  ],
  independentlyAnnotatedKnowledgeStates: ["known", "unknown", "disputed"],
} satisfies Input;
export const exampleOutput = {
  knownClaimTexts: ["confirmed record"],
  unknownClaimTexts: ["pending confirmation"],
  disputedClaimTexts: ["disputed accounts"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/what-we-know-dont-know-rolling-explainer-format-template",
  title: "What We Know Dont Know Rolling Explainer Format Template",
  description:
    "Structure caller independently verified rolling-explainer known/unknown/disputed evidence without silently converting uncertainty into confirmed facts; not factual authentication. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    { id: "knownClaimTexts", label: "Known claim texts", kind: "stringList" },
    {
      id: "unknownClaimTexts",
      label: "Unknown claim texts",
      kind: "stringList",
    },
    {
      id: "disputedClaimTexts",
      label: "Disputed claim texts",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerClaimIds: value.callerClaimIds as readonly string[],
      callerClaimTexts: value.callerClaimTexts as readonly string[],
      independentlyAnnotatedKnowledgeStates:
        value.independentlyAnnotatedKnowledgeStates as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
