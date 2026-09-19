import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch56-practice.js";
import * as imported from "../../demography/census-survival-migration-estimate/tool.js";
export const sourceTool = H.importedTool(
  imported,
  "demography/census-survival-migration-estimate",
);
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
  id: "random/demography-census-survival-migration-estimate-worked-example",
  title: "Random Census Survival Migration Estimate Worked Example Generator",
  description:
    "Finite educational practice-case sampler, not a new solver. Imports demography/census-survival-migration-estimate; Estimate intercensal net migration for an age cohort as the observed cohort at the second census minus the survivors implied by applying a national life-table census survival ratio to the first-census cohort. Caller candidate IDs remain distinct even for equal answers. Validate every supplied scenario through the imported contract, retain structured rejections, uniformly sample eligible IDs with explicit repeat policy and one advancing source, return prompts and actual answers separately with units/ports and replay metadata. No scientific truth, measurement, clinical/safety advice, certified product settings or application rendering implied. All imported model limitations apply.",
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
