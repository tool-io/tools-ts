import { practiceResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch56-practice.js";
import * as imported from "../barlow-effective-focal-length/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "astronomy/barlow-effective-focal-length",
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
      "Barlow Effective Focal Length Practice",
      "Random Barlow Effective Focal Length Worked Example Generator",
      "random/astronomy-barlow-effective-focal-length-worked-example",
      "random astronomy barlow effective focal length worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Barlow Effective Focal Length",
    ],
    collections: ["learn", "tutorial"],
    fields: ["astronomy"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Barlow Effective Focal Length",
    ],
  },
  id: "astronomy/barlow-effective-focal-length-practice",
  title: "Barlow Effective Focal Length Practice",
  description:
    "Create reproducible practice for Barlow Effective Focal Length from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
