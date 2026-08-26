import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HornOverlapIndexInput = {
  readonly propA1: number;
  readonly propA2: number;
  readonly propB1: number;
  readonly propB2: number;
};

export type HornOverlapIndexOutput = {
  readonly hornOverlapIndex: number;
};

export const hornOverlapIndexExample = {
  input: { propA1: 0.5, propA2: 0.5, propB1: 0.25, propB2: 0.75 },
  output: { hornOverlapIndex: 0.8888888888888888 },
} satisfies ToolExample<HornOverlapIndexInput, HornOverlapIndexOutput>;

export const hornOverlapIndexTool = createSimpleTool({
  id: "biology/horn-overlap-index",
  title: "Morisita-Horn Overlap",
  description:
    "Compare two communities with the Morisita-Horn similarity coefficient for two categories. Each pair of proportions must sum to one; zero means no shared composition and one means identical composition.",
  inputs: [
    {
      id: "propA1",
      kind: "number",
      label: "Community A resource 1 proportion",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "propA2",
      kind: "number",
      label: "Community A resource 2 proportion",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "propB1",
      kind: "number",
      label: "Community B resource 1 proportion",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "propB2",
      kind: "number",
      label: "Community B resource 2 proportion",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "hornOverlapIndex",
      kind: "number",
      label: "Horn overlap index",
    },
  ],
  calculate: (input) => {
    const propA1 = input.propA1 as number;
    const propA2 = input.propA2 as number;
    const propB1 = input.propB1 as number;
    const propB2 = input.propB2 as number;
    if (Math.abs(propA1 + propA2 - 1) > 1e-9)
      simpleError(
        "propA1",
        "Community A proportions must sum to one.",
        "invalid_proportions",
      );
    if (Math.abs(propB1 + propB2 - 1) > 1e-9)
      simpleError(
        "propB1",
        "Community B proportions must sum to one.",
        "invalid_proportions",
      );
    const numerator = 2 * (propA1 * propB1 + propA2 * propB2);
    const denominator =
      propA1 * propA1 + propA2 * propA2 + propB1 * propB1 + propB2 * propB2;
    return { hornOverlapIndex: numerator / denominator };
  },
});
export const runHornOverlapIndex = hornOverlapIndexTool.execute;
export default hornOverlapIndexTool;
