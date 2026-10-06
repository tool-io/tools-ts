import { boundedPracticeResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch57-practice.js";
import * as imported from "../percentage-of-number/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "proportions/percentage-of-number",
);
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
      { id: "canonical", input: { percent: 25, value: 80 } },
    ]),
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Percentage of Number Practice",
      "Random Percentage of Number Worked Example Generator",
      "random/proportions-percentage-of-number-worked-example",
      "random proportions percentage of number worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Percentage of Number Calculator",
    ],
    collections: ["learn", "tutorial"],
    fields: ["proportions"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Percentage of Number Calculator",
    ],
  },
  id: "proportions/percentage-of-number-practice",
  title: "Percentage of Number Practice",
  description:
    "Create reproducible practice for Percentage of Number Calculator from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
