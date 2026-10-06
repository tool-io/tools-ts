import { boundedPracticeResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch57-practice.js";
import * as imported from "../coin-show-budget-per-table/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "numismatics/coin-show-budget-per-table",
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
      { id: "canonical", input: H.canonicalInput(imported) },
    ]),
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Coin Show Budget Per Table Practice",
      "Random Coin Show Budget Per Table Worked Example Generator",
      "random/numismatics-coin-show-budget-per-table-worked-example",
      "random numismatics coin show budget per table worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Coin Show Budget Per Table",
    ],
    collections: ["learn", "tutorial"],
    fields: ["numismatics"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Coin Show Budget Per Table",
    ],
  },
  id: "numismatics/coin-show-budget-per-table-practice",
  title: "Coin Show Budget Per Table Practice",
  description:
    "Create reproducible practice for Coin Show Budget Per Table from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
