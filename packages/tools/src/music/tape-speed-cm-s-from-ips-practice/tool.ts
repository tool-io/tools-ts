import { boundedPracticeResultSchema } from "../../random/exercise-schema.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../random/batch57-practice.js";
import * as imported from "../tape-speed-cm-s-from-ips/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "music/tape-speed-cm-s-from-ips",
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
      "Tape Speed Cm S from Ips Practice",
      "Random Tape Speed Cm S From Ips Worked Example Generator",
      "random/music-tape-speed-cm-s-from-ips-worked-example",
      "random music tape speed cm s from ips worked example",
      "practice",
      "worked examples",
      "seeded sampling",
      "Tape Speed Cm S From Ips",
    ],
    collections: ["learn", "tutorial"],
    fields: ["music"],
    keywords: [
      "practice",
      "worked examples",
      "seeded sampling",
      "Tape Speed Cm S From Ips",
    ],
  },
  id: "music/tape-speed-cm-s-from-ips-practice",
  title: "Tape Speed Cm S from Ips Practice",
  description:
    "Create reproducible practice for Tape Speed Cm S from Ips from supplied scenarios, returning validated questions and computed answers under the source tool's assumptions and limits.",
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
