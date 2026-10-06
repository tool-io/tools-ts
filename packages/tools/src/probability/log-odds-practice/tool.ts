import { boundedPracticeResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch57-practice.js";
import * as imported from "../log-odds/tool.js";
export const sourceTool = H.importedTool(imported, "probability/log-odds");
export type Input = H.PracticeInput;
export type Output = ReturnType<typeof calculate>;
const fields = H.fields satisfies readonly SimpleField[];
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  H.validate(input, fields);
  return H.practice(sourceTool, input, context);
};
export const example = {
  input: {
    seed: "batch57-example",
    count: 1,
    withoutReplacement: true,
    candidatesJson: JSON.stringify([
      { id: "canonical", input: { probability: 0.5 } },
    ]),
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Log-Odds Practice",
      "Random Log-Odds Worked Example Generator",
      "random/probability-log-odds-worked-example",
      "random probability log odds worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Log-Odds Calculator",
    ],
    collections: ["learn", "tutorial"],
    fields: ["probability"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Log-Odds Calculator",
    ],
  },
  id: "probability/log-odds-practice",
  title: "Log-Odds Practice",
  description:
    "Create reproducible practice for Log-Odds Calculator from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Prompts, imported answers, model limits and replay metadata",
      kind: "object",

      schema: boundedPracticeResultSchema(sourceTool),
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
