import { practiceResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch56-practice.js";
import * as imported from "../transcript-drift-per-hour-estimator/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "archival-studies/transcript-drift-per-hour-estimator",
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
      "Transcript Sync Offset Drift Seconds per Hour Estimator Practice",
      "Random Transcript Sync Offset Drift Seconds per Hour Estimator Worked Example Generator",
      "random/archival-studies-transcript-drift-per-hour-estimator-worked-example",
      "random archival studies transcript drift per hour estimator worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Transcript Sync Offset Drift Seconds per Hour Estimator",
    ],
    collections: ["learn", "tutorial"],
    fields: ["archival-studies"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Transcript Sync Offset Drift Seconds per Hour Estimator",
    ],
  },
  id: "archival-studies/transcript-drift-per-hour-estimator-practice",
  title: "Transcript Sync Offset Drift Seconds per Hour Estimator Practice",
  description:
    "Create reproducible practice for Transcript Sync Offset Drift Seconds per Hour Estimator from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
