import { practiceResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch56-practice.js";
import * as imported from "../laskar-mean-obliquity/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "astrometry/laskar-mean-obliquity",
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
      "Laskar Mean Obliquity Practice",
      "Random Laskar Mean Obliquity Worked Example Generator",
      "random/astrometry-laskar-mean-obliquity-worked-example",
      "random astrometry laskar mean obliquity worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Laskar Mean Obliquity",
    ],
    collections: ["learn", "tutorial"],
    fields: ["astrometry"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Laskar Mean Obliquity",
    ],
  },
  id: "astrometry/laskar-mean-obliquity-practice",
  title: "Laskar Mean Obliquity Practice",
  description:
    "Create reproducible practice for Laskar Mean Obliquity from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
