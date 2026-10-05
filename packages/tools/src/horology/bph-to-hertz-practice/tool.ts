import { practiceResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch56-practice.js";
import * as imported from "../bph-to-hertz/tool.js";
export const sourceTool = H.importedTool(imported, "horology/bph-to-hertz");
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
      "Bph to Hertz Practice",
      "Random Bph To Hertz Worked Example Generator",
      "random/horology-bph-to-hertz-worked-example",
      "random horology bph to hertz worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Bph To Hertz",
    ],
    collections: ["learn", "tutorial"],
    fields: ["horology"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Bph To Hertz",
    ],
  },
  id: "horology/bph-to-hertz-practice",
  title: "Bph to Hertz Practice",
  description:
    "Create reproducible practice for Bph to Hertz from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
