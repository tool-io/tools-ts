import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  binary,
  unique,
  ordered,
  simpleError,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly callerObservedTransmissionNodes: readonly string[];
  readonly callerObservedLinkEvidenceKnown: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerObservedTransmissionNodes",
    label: "Caller observed transmission nodes",
    kind: "stringList",
  },
  {
    id: "callerObservedLinkEvidenceKnown",
    label: "Caller observed link evidence known",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerObservedTransmissionNodes, "distinct chain nodes");
  if (
    input.callerObservedLinkEvidenceKnown.length !==
    input.callerObservedTransmissionNodes.length - 1
  )
    simpleError(
      "links",
      "One explicit known flag per caller ordered transmission link.",
    );
  binary(input.callerObservedLinkEvidenceKnown, "known");
  const first = input.callerObservedLinkEvidenceKnown.indexOf(0);
  return {
    observedChainDepth: input.callerObservedLinkEvidenceKnown.length,
    fullyWitnessedPrefixDepth:
      first < 0 ? input.callerObservedLinkEvidenceKnown.length : first,
    unknownLinkIndices: input.callerObservedLinkEvidenceKnown.flatMap((v, i) =>
      v ? [] : [i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerObservedTransmissionNodes: ["speaker", "friend", "friend-of-friend"],
    callerObservedLinkEvidenceKnown: [1, 0],
  },
  output: {
    result: {
      observedChainDepth: 2,
      fullyWitnessedPrefixDepth: 1,
      unknownLinkIndices: [1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/foaf-friend-of-a-friend-chain-depth-lookup",
  title: "Foaf Friend of a Friend Chain Depth Lookup",
  description:
    "Measure explicit ordered FOAF report transmission depth while retaining missing link evidence; distinct IDs prevent an unacknowledged loop. No authentication of story or contacts.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
