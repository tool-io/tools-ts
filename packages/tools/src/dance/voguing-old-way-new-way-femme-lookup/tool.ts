import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly voguingCategory: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "voguingCategory", label: "Voguing category", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.voguingCategory,
      {
        "old-way": "poses, lines and precision in the named ballroom tradition",
        "new-way":
          "angular control and flexibility-oriented vocabulary in the named tradition",
        femme:
          "feminine performance vocabulary commonly described by hands, catwalk, duckwalk, floor performance and spins/dips",
      },
      "voguingCategory",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { voguingCategory: "old-way" } satisfies Input;
export const exampleOutput = {
  meaning: "poses, lines and precision in the named ballroom tradition",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/voguing-old-way-new-way-femme-lookup",
  title: "Voguing Old Way New Way Femme Lookup",
  description:
    "Common named voguing category descriptors, not a complete community taxonomy, identity inference or safe flexibility/dip instruction. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ voguingCategory: value.voguingCategory as string }),
});
export const run = tool.execute;
export default tool;
