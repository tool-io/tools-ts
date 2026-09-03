import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, unique, safeText } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerKeyPrefixes: readonly string[];
  readonly candidatePrefix: string;
}>;
export type Output = Readonly<{
  readonly existingPrefixesContainingCandidate: readonly string[];
  readonly existingPrefixesContainedByCandidate: readonly string[];
  readonly unambiguousPrefixDispatch: boolean;
}>;
const inputFields = [
  { id: "callerKeyPrefixes", label: "Caller key prefixes", kind: "stringList" },
  { id: "candidatePrefix", label: "Candidate prefix", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerKeyPrefixes, "prefixes");
  safeText(input.candidatePrefix, "prefix");
  if (input.callerKeyPrefixes.includes(input.candidatePrefix))
    simpleError("candidate", "Candidate already exists in prefix registry.");
  const containing = input.callerKeyPrefixes.filter((v) =>
      v.startsWith(input.candidatePrefix),
    ),
    contained = input.callerKeyPrefixes.filter((v) =>
      input.candidatePrefix.startsWith(v),
    );
  return {
    existingPrefixesContainingCandidate: containing,
    existingPrefixesContainedByCandidate: contained,
    unambiguousPrefixDispatch: !containing.length && !contained.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerKeyPrefixes: ["sk_live_", "sk_test_"],
  candidatePrefix: "sk_",
} satisfies Input;
export const exampleOutput = {
  existingPrefixesContainingCandidate: ["sk_live_", "sk_test_"],
  existingPrefixesContainedByCandidate: [],
  unambiguousPrefixDispatch: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/api-key-prefix-separability-checker",
  title: "API Key Prefix Separability Check",
  description:
    "Audit exact prefix-free API-key dispatch against explicit caller registry, no secret inspection or inferred provider; separability does not establish authentication/security.",
  inputs: inputFields,
  outputs: [
    {
      id: "existingPrefixesContainingCandidate",
      label: "Existing prefixes containing candidate",
      kind: "stringList",
    },
    {
      id: "existingPrefixesContainedByCandidate",
      label: "Existing prefixes contained by candidate",
      kind: "stringList",
    },
    {
      id: "unambiguousPrefixDispatch",
      label: "Unambiguous prefix dispatch",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerKeyPrefixes: value.callerKeyPrefixes as readonly string[],
      candidatePrefix: value.candidatePrefix as string,
    }),
});
export const run = tool.execute;
export default tool;
