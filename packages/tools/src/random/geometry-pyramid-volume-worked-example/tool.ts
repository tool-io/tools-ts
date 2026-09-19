import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch56-practice.js";
import * as imported from "../../geometry/pyramid-volume/tool.js";
export const sourceTool = H.importedTool(imported, "geometry/pyramid-volume");
export type Input = H.PracticeInput;
export type Output = H.PracticeOutput;
const fields = H.fields satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
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
  id: "random/geometry-pyramid-volume-worked-example",
  title: "Random Square Pyramid Volume Worked Example Generator",
  description:
    "Finite educational practice-case sampler, not a new solver. Imports geometry/pyramid-volume; Calculate the volume of a right square pyramid from its base edge and perpendicular height as (a\u00b2\u00b7h)/3. Caller candidate IDs remain distinct even for equal answers. Validate every supplied scenario through the imported contract, retain structured rejections, uniformly sample eligible IDs with explicit repeat policy and one advancing source, return prompts and actual answers separately with units/ports and replay metadata. No scientific truth, measurement, clinical/safety advice, certified product settings or application rendering implied. All imported model limitations apply.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Practice prompts, imported answer data and source metadata",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
