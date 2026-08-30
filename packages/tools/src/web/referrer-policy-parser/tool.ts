import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReferrerPolicyParserInput = Readonly<{
  readonly header: string;
}>;
export type ReferrerPolicyParserOutput = Readonly<{
  readonly selectedPolicy: string;
  readonly recognized: boolean;
}>;

export const calculateReferrerPolicyParser = (
  x: ReferrerPolicyParserInput,
): ReferrerPolicyParserOutput => {
  if (typeof x.header !== "string") simpleError("header", "Provide a string.");
  const valid = new Set([
    "no-referrer",
    "no-referrer-when-downgrade",
    "same-origin",
    "origin",
    "strict-origin",
    "origin-when-cross-origin",
    "strict-origin-when-cross-origin",
    "unsafe-url",
  ]);
  let selectedPolicy = "";
  for (const part of x.header.split(",")) {
    const token = part.trim().toLowerCase();
    if (valid.has(token)) selectedPolicy = token;
  }
  return { selectedPolicy, recognized: selectedPolicy !== "" };
};

export const example = {
  input: { header: "no-referrer, strict-origin-when-cross-origin" },
  output: {
    selectedPolicy: "strict-origin-when-cross-origin",
    recognized: true,
  },
} satisfies ToolExample<ReferrerPolicyParserInput, ReferrerPolicyParserOutput>;

export const tool = createSimpleTool({
  id: "web/referrer-policy-parser",
  title: "Referrer Policy Parser",
  description:
    "Select the last recognized token from a comma-separated Referrer-Policy header while preserving an empty result if none is recognized.",
  inputs: [{ id: "header", kind: "string", label: "Referrer-Policy header" }],
  outputs: [
    { id: "selectedPolicy", kind: "string", label: "Last recognized policy" },
    { id: "recognized", kind: "boolean", label: "Recognized a policy" },
  ],
  calculate: (input) =>
    calculateReferrerPolicyParser({
      header: input.header as string,
    }),
});
export const referrerPolicyParserTool = tool;
export const runReferrerPolicyParser = tool.execute;
export default tool;
