import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedWebsiteHost: string;
  readonly firstPathName: string;
  readonly secondPathName: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedWebsiteHost",
    label: "Caller verified website host",
    kind: "string",
  },
  { id: "firstPathName", label: "First path name", kind: "string" },
  { id: "secondPathName", label: "Second path name", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !/^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/.test(
      input.callerVerifiedWebsiteHost,
    ) ||
    input.callerVerifiedWebsiteHost.length > 253 ||
    [input.firstPathName, input.secondPathName].some(
      (v) => !v.trim() || v.length > 64,
    )
  )
    simpleError("url", "Actual bounded caller host/names.");
  return {
    conditionalUrlCandidate:
      "https://" +
      input.callerVerifiedWebsiteHost +
      "/" +
      encodeURIComponent(input.firstPathName.trim()) +
      "-" +
      encodeURIComponent(input.secondPathName.trim()),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedWebsiteHost: "example.com",
    firstPathName: "Ada",
    secondPathName: "Ben",
  },
  output: {
    result: { conditionalUrlCandidate: "https://example.com/Ada-Ben" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-website-url-generator",
  title: "Wedding Website URL Generator",
  description:
    "HTTPSwedding website path candidate under explicitly owned caller host, encode names. Does not register, check DNSavailability, create a site or guarantee security; no credentials/query/port host forms.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
