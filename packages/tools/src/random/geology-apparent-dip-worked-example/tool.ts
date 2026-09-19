import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch56-practice.js";
import * as imported from "../../geology/apparent-dip/tool.js";
export const sourceTool = H.importedTool(imported, "geology/apparent-dip");
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
  id: "random/geology-apparent-dip-worked-example",
  title: "Random Apparent Dip Worked Example Generator",
  description:
    "Finite educational practice-case sampler, not a new solver. Imports geology/apparent-dip; Apparent dip seen on a vertical section: tan(delta_apparent) = tan(delta_true) * cos(theta), where theta is the angle between the section and the dip direction. Caller candidate IDs remain distinct even for equal answers. Validate every supplied scenario through the imported contract, retain structured rejections, uniformly sample eligible IDs with explicit repeat policy and one advancing source, return prompts and actual answers separately with units/ports and replay metadata. No scientific truth, measurement, clinical/safety advice, certified product settings or application rendering implied. All imported model limitations apply.",
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
