import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly structure: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "structure", label: "Structure", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.structure,
      {
        "common-six-count":
          "Common pattern: walk-walk, triple step, anchor triple; styling and music can change counts.",
        "common-eight-count":
          "Eight-count patterns add count structure; anchor is an ending connection/timing concept, not necessarily one rigid foot sequence.",
      },
      "structure",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { structure: "common-six-count" },
  output: {
    result: {
      reference:
        "Common pattern: walk-walk, triple step, anchor triple; styling and music can change counts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/west-coast-swing-slot-anchor-structure-lookup",
  title: "West Coast Swing Slot Anchor Structure Lookup",
  description:
    "Bounded common West Coast Swing slot/anchor teaching notes, not readiness or full dance instruction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
