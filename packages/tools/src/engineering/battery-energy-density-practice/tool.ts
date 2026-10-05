import { practiceResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch56-practice.js";
import * as imported from "../battery-energy-density/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "engineering/battery-energy-density",
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
      "Battery Energy Density Practice",
      "Random Battery Energy Density Worked Example Generator",
      "random/engineering-battery-energy-density-worked-example",
      "random engineering battery energy density worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Battery Energy Density",
    ],
    collections: ["learn", "tutorial"],
    fields: ["engineering"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Battery Energy Density",
    ],
  },
  id: "engineering/battery-energy-density-practice",
  title: "Battery Energy Density Practice",
  description:
    "Create reproducible practice for Battery Energy Density from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
