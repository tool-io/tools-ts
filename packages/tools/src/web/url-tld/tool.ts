import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  absoluteUrl,
} from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualAbsoluteUrl: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualAbsoluteUrl", label: "Actual absolute url", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const h = absoluteUrl(input.actualAbsoluteUrl).hostname;
  if (!h || h.startsWith("[") || /^[0-9.]+$/.test(h))
    simpleError("host", "ActualDNShostname,noIPliteral.");
  return { observedLastDnsLabel: h.replace(/\.$/, "").split(".").at(-1)! };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualAbsoluteUrl: "https://sub.example.co.uk/path" },
  output: { result: { observedLastDnsLabel: "uk" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/url-tld",
  title: "URL TLD Calculator",
  description:
    "LastnormalizedDNSlabelofactualabsoluteURL using existing WHATWG parser. TLD string not a registry validation, public suffix or registrable domain, IP/empty hosts rejected, no network lookup.",
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
