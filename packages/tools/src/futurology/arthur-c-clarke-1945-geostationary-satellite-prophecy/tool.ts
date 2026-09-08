import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
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
          "Clarke's 1945 Extra-Terrestrial Relays essay describes using geostationary relay satellites for global communications.",
        reference: "Clarke, Wireless World, October 1945.",
        limitations:
          "Historical proposal, not sole invention of geostationary orbit or a complete engineering design.",
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
      text: "Clarke's 1945 Extra-Terrestrial Relays essay describes using geostationary relay satellites for global communications.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/arthur-c-clarke-1945-geostationary-satellite-prophecy",
  title: "Arthur C Clarke 1945 Geostationary Satellite Prophecy",
  description:
    "Bounded offline reference: Clarke's 1945 Extra-Terrestrial Relays essay describes using geostationary relay satellites for global communications. Source: Clarke, Wireless World, October 1945. Historical proposal, not sole invention of geostationary orbit or a complete engineering design. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
