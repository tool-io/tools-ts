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
          "Linklater and Fitzmaurice voice approaches have distinct histories and practices addressing voice/body relations.",
        reference:
          "Linklater, Freeing the Natural Voice; Fitzmaurice Voicework documentation.",
        limitations:
          "No self-directed therapeutic routine or universal superior method; qualified individualized instruction matters.",
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
      text: "Linklater and Fitzmaurice voice approaches have distinct histories and practices addressing voice/body relations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/linklater-versus-fitzmaurice-voice-method-compare-lookup",
  title: "Linklater Versus Fitzmaurice Voice Method Compare Lookup",
  description:
    "Bounded offline reference: Linklater and Fitzmaurice voice approaches have distinct histories and practices addressing voice/body relations. Source: Linklater, Freeing the Natural Voice; Fitzmaurice Voicework documentation. No self-directed therapeutic routine or universal superior method; qualified individualized instruction matters. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
