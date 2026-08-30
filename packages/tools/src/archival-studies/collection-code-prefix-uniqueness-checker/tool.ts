import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, lines } from "../shared.js";
export type Input = Readonly<{
  readonly collectionPrefixes: string;
  readonly caseSensitivePrefixes: boolean;
}>;
export type Output = Readonly<{
  readonly exactDuplicatePrefixCount: number;
  readonly ambiguousLeadingPrefixPairs: string;
  readonly prefixSetUnambiguous: boolean;
}>;
const inputFields = [
  { id: "collectionPrefixes", label: "Collection prefixes", kind: "string" },
  {
    id: "caseSensitivePrefixes",
    label: "Case sensitive prefixes",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = lines(input.collectionPrefixes, "prefixes");
  if (p.some((v) => !/^[A-Za-z][A-Za-z0-9_-]{0,31}$/.test(v)))
    simpleError("prefix", "Bounded ASCII collection prefixes required.");
  const v = p.map((s) => (input.caseSensitivePrefixes ? s : s.toUpperCase())),
    pairs: string[] = [];
  let duplicates = 0;
  for (let i = 0; i < v.length; i++)
    for (let j = i + 1; j < v.length; j++) {
      if (v[i] === v[j]) duplicates++;
      if (v[i].startsWith(v[j]) || v[j].startsWith(v[i])) {
        if (pairs.length === 100000)
          simpleError("pairs", "Bounded ambiguity output required.");
        pairs.push(`${i}:${j}`);
      }
    }
  if (pairs.length > 100000)
    simpleError("pairs", "Bounded ambiguity output required.");
  return {
    exactDuplicatePrefixCount: duplicates,
    ambiguousLeadingPrefixPairs: pairs.join("\n"),
    prefixSetUnambiguous: pairs.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  collectionPrefixes: "ABC\nAB\nXYZ",
  caseSensitivePrefixes: false,
} satisfies Input;
export const exampleOutput = {
  exactDuplicatePrefixCount: 0,
  ambiguousLeadingPrefixPairs: "0:1",
  prefixSetUnambiguous: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/collection-code-prefix-uniqueness-checker",
  title: "Collection Code Prefix Uniqueness Checker",
  description:
    "Audit exact and leading-prefix collection-code ambiguities under explicit case policy; prefix comparisons are bounded to 1000 records, not authority registry validation.",
  inputs: inputFields,
  outputs: [
    {
      id: "exactDuplicatePrefixCount",
      label: "Exact duplicate prefix count",
      kind: "number",
    },
    {
      id: "ambiguousLeadingPrefixPairs",
      label: "Ambiguous leading prefix pairs",
      kind: "string",
    },
    {
      id: "prefixSetUnambiguous",
      label: "Prefix set unambiguous",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      collectionPrefixes: value.collectionPrefixes as string,
      caseSensitivePrefixes: value.caseSensitivePrefixes as boolean,
    }),
});
export const run = tool.execute;
export default tool;
