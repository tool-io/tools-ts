import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeafDryMatterContentInput = {
  readonly leafDryMassG: number;
  readonly leafFreshMassG: number;
};

export type LeafDryMatterContentOutput = {
  readonly leafDryMatterContentPercent: number;
};

export const leafDryMatterContentExample = {
  input: { leafDryMassG: 0.4, leafFreshMassG: 1 },
  output: { leafDryMatterContentPercent: 40 },
} satisfies ToolExample<LeafDryMatterContentInput, LeafDryMatterContentOutput>;

export const leafDryMatterContentTool = createSimpleTool({
  id: "biology/leaf-dry-matter-content",
  title: "LDMC Percent",
  description:
    "Compute leaf dry matter content as a percentage from oven dry leaf mass over turgid fresh leaf mass.",
  inputs: [
    {
      id: "leafDryMassG",
      kind: "number",
      label: "Leaf dry mass",
      minimum: 0,
      unit: "g",
    },
    {
      id: "leafFreshMassG",
      kind: "number",
      label: "Leaf fresh mass",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "leafDryMatterContentPercent",
      kind: "number",
      label: "Leaf dry matter content",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const leafDryMassG = input.leafDryMassG as number;
    const leafFreshMassG = input.leafFreshMassG as number;
    if (!(leafFreshMassG > 0))
      simpleError(
        "leafFreshMassG",
        "The leaf fresh mass must be greater than zero.",
      );
    if (leafDryMassG > leafFreshMassG)
      simpleError(
        "leafDryMassG",
        "The leaf dry mass must not exceed the leaf fresh mass.",
        "invalid_masses",
      );
    return {
      leafDryMatterContentPercent: (leafDryMassG / leafFreshMassG) * 100,
    };
  },
});
export const runLeafDryMatterContent = leafDryMatterContentTool.execute;
export default leafDryMatterContentTool;
