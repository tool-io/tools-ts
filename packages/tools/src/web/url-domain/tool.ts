import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, domainParts } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualAbsoluteUrl: string;
  readonly callerVerifiedExactPublicSuffixes: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualAbsoluteUrl", label: "Actual absolute url", kind: "string" },
  {
    id: "callerVerifiedExactPublicSuffixes",
    label: "Caller verified exact public suffixes",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const a = domainParts(
    input.actualAbsoluteUrl,
    input.callerVerifiedExactPublicSuffixes,
  );
  return {
    observedQualifiedRegistrableDomain: a.domain,
    matchedExactPublicSuffix: a.suffix,
    matchedRegistrableDomainAvailable: a.available,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualAbsoluteUrl: "https://a.b.example.co.uk/path",
    callerVerifiedExactPublicSuffixes: ["com", "co.uk"],
  },
  output: {
    result: {
      observedQualifiedRegistrableDomain: "example.co.uk",
      matchedExactPublicSuffix: "co.uk",
      matchedRegistrableDomainAvailable: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/url-domain",
  title: "URL Domain Calculator",
  description:
    "Actual DNS qualified registrable domain using caller independently verified applicable EXACT public suffix records, longest match. No naive last-two-label assumption, PSL wildcard/exception processing, live authority/network request; only actual expanded exact suffixes accepted, unknown host explicit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
