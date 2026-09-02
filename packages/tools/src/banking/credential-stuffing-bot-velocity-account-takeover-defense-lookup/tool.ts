import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Credential stuffing attempts reuse exposed credentials; defensive controls can include rate limits, monitoring, strong authentication and secure recovery.",
        reference: "OWASP, Credential Stuffing Prevention Cheat Sheet.",
        limitations:
          "Defensive summary only; no credential harvesting, attack automation or guaranteed account-takeover prevention.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Credential stuffing attempts reuse exposed credentials; defensive controls can include rate limits, monitoring, strong authentication and secure recovery.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/credential-stuffing-bot-velocity-account-takeover-defense-lookup",
  title: "Credential Stuffing Bot Velocity Account Takeover Defense Lookup",
  description:
    "Bounded offline reference: Credential stuffing attempts reuse exposed credentials; defensive controls can include rate limits, monitoring, strong authentication and secure recovery. Source: OWASP, Credential Stuffing Prevention Cheat Sheet. Defensive summary only; no credential harvesting, attack automation or guaranteed account-takeover prevention. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
