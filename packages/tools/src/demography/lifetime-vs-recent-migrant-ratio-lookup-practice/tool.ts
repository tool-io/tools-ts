import { practiceResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch56-practice.js";
import * as imported from "../lifetime-vs-recent-migrant-ratio-lookup/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "demography/lifetime-vs-recent-migrant-ratio-lookup",
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
      "Lifetime Vs Recent Migrant Ratio Practice",
      "Random Lifetime Vs Recent Migrant Ratio Lookup Worked Example Generator",
      "random/demography-lifetime-vs-recent-migrant-ratio-lookup-worked-example",
      "random demography lifetime vs recent migrant ratio lookup worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Lifetime Vs Recent Migrant Ratio Lookup",
    ],
    collections: ["learn", "tutorial"],
    fields: ["demography"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Lifetime Vs Recent Migrant Ratio Lookup",
    ],
  },
  id: "demography/lifetime-vs-recent-migrant-ratio-lookup-practice",
  title: "Lifetime Vs Recent Migrant Ratio Practice",
  description:
    "Create reproducible practice for Lifetime Vs Recent Migrant Ratio Lookup from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
