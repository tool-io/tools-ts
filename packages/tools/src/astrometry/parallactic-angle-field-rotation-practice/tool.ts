import { practiceResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch56-practice.js";
import * as imported from "../parallactic-angle-field-rotation/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "astrometry/parallactic-angle-field-rotation",
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
      "Parallactic Angle Field Rotation Practice",
      "Random Parallactic Angle Field Rotation Worked Example Generator",
      "random/astrometry-parallactic-angle-field-rotation-worked-example",
      "random astrometry parallactic angle field rotation worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Parallactic Angle Field Rotation",
    ],
    collections: ["learn", "tutorial"],
    fields: ["astrometry"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Parallactic Angle Field Rotation",
    ],
  },
  id: "astrometry/parallactic-angle-field-rotation-practice",
  title: "Parallactic Angle Field Rotation Practice",
  description:
    "Create reproducible practice for Parallactic Angle Field Rotation from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
