import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly webbDokLevel: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "webbDokLevel", label: "Webb dok level", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.webbDokLevel,
      {
        "1": "recall and reproduction",
        "2": "skills and concepts with some processing or decisions",
        "3": "strategic reasoning and evidence-based justification",
        "4": "extended thinking with complex synthesis across time or contexts",
      },
      "webbDokLevel",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { webbDokLevel: "3" } satisfies Input;
export const exampleOutput = {
  meaning: "strategic reasoning and evidence-based justification",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/webbs-depth-of-knowledge-four-levels-lookup",
  title: "Webbs Depth of Knowledge Four Levels Lookup",
  description:
    "Look up Webb's four Depth of Knowledge descriptors. Cognitive demand depends on the whole task, not a verb, elapsed minutes or difficulty alone. Does not grade learner responses or establish learning efficacy.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ webbDokLevel: value.webbDokLevel as string }),
});
export const run = tool.execute;
export default tool;
