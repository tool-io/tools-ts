import { boundedPracticeResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch57-practice.js";
import * as imported from "../die-rotation-error-degrees/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "numismatics/die-rotation-error-degrees",
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
      "Die Rotation Error Degrees Practice",
      "Random Die Rotation Error Degrees Worked Example Generator",
      "random/numismatics-die-rotation-error-degrees-worked-example",
      "random numismatics die rotation error degrees worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Die Rotation Error Degrees",
    ],
    collections: ["learn", "tutorial"],
    fields: ["numismatics"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Die Rotation Error Degrees",
    ],
  },
  id: "numismatics/die-rotation-error-degrees-practice",
  title: "Die Rotation Error Degrees Practice",
  description:
    "Create reproducible practice for Die Rotation Error Degrees from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
