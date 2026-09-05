import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
  pick,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPublicationContext: string;
  readonly callerHouseStyleByContextKeys: readonly string[];
  readonly callerVerifiedCasePolicies: readonly string[];
}>;
export type Output = Readonly<{ readonly callerSelectedCasePolicy: string }>;
const inputFields = [
  {
    id: "callerPublicationContext",
    label: "Caller publication context",
    kind: "string",
  },
  {
    id: "callerHouseStyleByContextKeys",
    label: "Caller house style by context keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedCasePolicies",
    label: "Caller verified case policies",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerHouseStyleByContextKeys,
    input.callerVerifiedCasePolicies,
    "callerHouseStyleByContextKeys",
  );
  input.callerVerifiedCasePolicies.forEach((v) =>
    pick(
      v,
      { "sentence-case": 0, "title-case": 1, "preserve-original": 2 },
      "policy",
    ),
  );
  return {
    callerSelectedCasePolicy:
      input.callerVerifiedCasePolicies[
        catalogIndex(
          input.callerHouseStyleByContextKeys,
          input.callerPublicationContext,
        )
      ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPublicationContext: "news-prose",
  callerHouseStyleByContextKeys: ["news-prose", "book-title"],
  callerVerifiedCasePolicies: ["sentence-case", "title-case"],
} satisfies Input;
export const exampleOutput = {
  callerSelectedCasePolicy: "sentence-case",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/title-case-vs-sentence-case-headline-selector",
  title: "Title Case vs Sentence Case Headline Selector",
  description:
    "Select independently verified headline-case house policy by exact context, not destructive capitalization of proper names or automatic title-case grammar. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerSelectedCasePolicy",
      label: "Caller selected case policy",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPublicationContext: value.callerPublicationContext as string,
      callerHouseStyleByContextKeys:
        value.callerHouseStyleByContextKeys as readonly string[],
      callerVerifiedCasePolicies:
        value.callerVerifiedCasePolicies as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
