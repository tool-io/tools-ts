import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch57-practice.js";
import * as imported from "../../math/chebyshev-theta/tool.js";
export const sourceTool = H.importedTool(imported, "math/chebyshev-theta");
export type Input = H.PracticeInput;
export type Output = H.PracticeOutput;
const fields = H.fields satisfies readonly SimpleField[];
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
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
  id: "random/math-chebyshev-theta-worked-example",
  title: "Random Chebyshev Theta Function Worked Example Generator",
  description:
    "Uniformly sample explicit eligible candidate IDs for math/chebyshev-theta practice with replay metadata and separate prompts/imported answers; retain its model limits, units, structured rejections and explicit practice resource bounds, not measured facts or safety/clinical approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Prompts, imported answers, model limits and replay metadata",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
