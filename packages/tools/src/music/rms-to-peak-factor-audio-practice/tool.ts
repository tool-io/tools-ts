import { boundedPracticeResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch57-practice.js";
import * as imported from "../rms-to-peak-factor-audio/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "music/rms-to-peak-factor-audio",
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
      "RMS to Peak Factor Audio Practice",
      "Random Rms To Peak Factor Audio Worked Example Generator",
      "random/music-rms-to-peak-factor-audio-worked-example",
      "random music rms to peak factor audio worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Rms To Peak Factor Audio",
    ],
    collections: ["learn", "tutorial"],
    fields: ["music"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Rms To Peak Factor Audio",
    ],
  },
  id: "music/rms-to-peak-factor-audio-practice",
  title: "RMS to Peak Factor Audio Practice",
  description:
    "Create reproducible practice for RMS to Peak Factor Audio from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
