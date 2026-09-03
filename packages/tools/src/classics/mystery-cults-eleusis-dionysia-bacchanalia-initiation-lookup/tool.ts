import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Eleusinian and Dionysiac initiation traditions differ; the 186 BCE Roman Bacchanalian decree concerns a particular regulated context.",
        reference:
          "Homeric Hymn to Demeter; Livy 39; Senatus consultum de Bacchanalibus.",
        limitations:
          "No reconstruction of secret rites or assurance of ritual efficacy.",
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
      text: "Eleusinian and Dionysiac initiation traditions differ; the 186 BCE Roman Bacchanalian decree concerns a particular regulated context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/mystery-cults-eleusis-dionysia-bacchanalia-initiation-lookup",
  title: "Mystery Cults Eleusis Dionysia Bacchanalia Initiation Lookup",
  description:
    "Offline bounded reference card: Eleusinian and Dionysiac initiation traditions differ; the 186 BCE Roman Bacchanalian decree concerns a particular regulated context. References Homeric Hymn to Demeter; Livy 39; Senatus consultum de Bacchanalibus. No reconstruction of secret rites or assurance of ritual efficacy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
