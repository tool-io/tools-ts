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
  unique,
  safeText,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerIinPrefixes: readonly string[];
  readonly callerIssuerLabels: readonly string[];
  readonly callerNetworkLabels: readonly string[];
  readonly queryIinDigits: string;
}>;
export type Output = Readonly<{
  readonly longestMatchingCallerIinPrefix: string;
  readonly callerIssuerLabel: string;
  readonly callerNetworkLabel: string;
}>;
const inputFields = [
  { id: "callerIinPrefixes", label: "Caller iin prefixes", kind: "stringList" },
  {
    id: "callerIssuerLabels",
    label: "Caller issuer labels",
    kind: "stringList",
  },
  {
    id: "callerNetworkLabels",
    label: "Caller network labels",
    kind: "stringList",
  },
  { id: "queryIinDigits", label: "Query iin digits", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerIinPrefixes, "prefixes");
  aligned(input.callerIinPrefixes, input.callerIssuerLabels, "issuers");
  aligned(input.callerIinPrefixes, input.callerNetworkLabels, "networks");
  if (
    !/^[0-9]{6,8}$(?![\s\S])/.test(input.queryIinDigits) ||
    input.callerIinPrefixes.some(
      (s) => !/^(?:[0-9]{6}|[0-9]{8})$(?![\s\S])/.test(s),
    )
  )
    simpleError(
      "IIN",
      "Only6/8-digit caller IIN prefixes/query, not full payment-card numbers.",
    );
  input.callerIssuerLabels.forEach((v) => safeText(v, "issuer"));
  input.callerNetworkLabels.forEach((v) => safeText(v, "network"));
  const matches = input.callerIinPrefixes
    .map((p, i) => ({ p, i }))
    .filter((v) => input.queryIinDigits.startsWith(v.p))
    .sort((a, b) => b.p.length - a.p.length);
  if (!matches.length)
    simpleError(
      "query",
      "IIN absent from independently verified caller prefix registry.",
    );
  const { p, i } = matches[0];
  return {
    longestMatchingCallerIinPrefix: p,
    callerIssuerLabel: input.callerIssuerLabels[i],
    callerNetworkLabel: input.callerNetworkLabels[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIinPrefixes: ["123456", "12345678"],
  callerIssuerLabels: ["issuer-a", "issuer-b"],
  callerNetworkLabels: ["network-a", "network-b"],
  queryIinDigits: "12345678",
} satisfies Input;
export const exampleOutput = {
  longestMatchingCallerIinPrefix: "12345678",
  callerIssuerLabel: "issuer-b",
  callerNetworkLabel: "network-b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/bin-iin-issuer-network-lookup",
  title: "BIN IIN Issuer Network Lookup",
  description:
    "Longest-prefix6/8-digit IIN resolution through caller independently verified issuer/network registry, no external bank lookup, PAN validation or current assignment guarantee. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "longestMatchingCallerIinPrefix",
      label: "Longest matching caller iin prefix",
      kind: "string",
    },
    { id: "callerIssuerLabel", label: "Caller issuer label", kind: "string" },
    { id: "callerNetworkLabel", label: "Caller network label", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      callerIinPrefixes: value.callerIinPrefixes as readonly string[],
      callerIssuerLabels: value.callerIssuerLabels as readonly string[],
      callerNetworkLabels: value.callerNetworkLabels as readonly string[],
      queryIinDigits: value.queryIinDigits as string,
    }),
});
export const run = tool.execute;
export default tool;
