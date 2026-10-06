import { boundedPracticeResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch57-practice.js";
import * as imported from "../edge-board-length-pallet-total/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "logistics/edge-board-length-pallet-total",
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
      "Edge Board Length Pallet Total Practice",
      "Random Edge Board Length Pallet Total Worked Example Generator",
      "random/logistics-edge-board-length-pallet-total-worked-example",
      "random logistics edge board length pallet total worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Edge Board Length Pallet Total",
    ],
    collections: ["learn", "tutorial"],
    fields: ["logistics"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Edge Board Length Pallet Total",
    ],
  },
  id: "logistics/edge-board-length-pallet-total-practice",
  title: "Edge Board Length Pallet Total Practice",
  description:
    "Create reproducible practice for Edge Board Length Pallet Total from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
