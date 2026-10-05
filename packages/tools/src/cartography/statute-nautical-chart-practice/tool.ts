import { practiceResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch56-practice.js";
import * as imported from "../statute-nautical-chart-converter/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "cartography/statute-nautical-chart-converter",
);
export type Input = H.PracticeInput;
export type Output = ReturnType<typeof calculate>;
const fields = H.fields satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  return H.practice(sourceTool, i, context);
};
export const example = {
  input: {
    seed: "batch56-example",
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
      "Statute Nautical Chart Practice",
      "Random Statute Nautical Chart Converter Worked Example Generator",
      "random/cartography-statute-nautical-chart-converter-worked-example",
      "random cartography statute nautical chart converter worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Statute Nautical Chart Converter",
    ],
    collections: ["learn", "tutorial"],
    fields: ["cartography"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Statute Nautical Chart Converter",
    ],
  },
  id: "cartography/statute-nautical-chart-practice",
  title: "Statute Nautical Chart Practice",
  description:
    "Create reproducible practice for Statute Nautical Chart Converter from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Practice prompts, imported answer data and source metadata",
      kind: "object",

      schema: practiceResultSchema(sourceTool),
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
