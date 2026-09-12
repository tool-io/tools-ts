import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualUserAgentHeader: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualUserAgentHeader",
    label: "Actual user agent header",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (/[\r\n]/.test(input.actualUserAgentHeader))
    simpleError("UA", "OneactualUAfieldwithoutlineinjection.");
  return {
    heuristicPatternMatch:
      /Googlebot|Bingbot|DuckDuckBot|Baiduspider|YandexBot|Slurp|crawler|spider|bot/i.test(
        input.actualUserAgentHeader,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualUserAgentHeader: "Go ogle bot/2.1 Mobile" },
  output: { result: { heuristicPatternMatch: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/user-agent-is-bot",
  title: "HTTP User Agent Is Bot Calculator",
  description:
    "Bounded heuristic based on a spoofable User-Agent bot token pattern match, not reliable device/identity/automation classification or security/authentication decision. Empty string matches false, no network or parser claim.",
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
