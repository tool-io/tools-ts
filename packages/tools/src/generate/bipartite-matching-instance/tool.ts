import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export type BipartiteMatchingInstance = {
  readonly edges: readonly (readonly [number, number])[];
  readonly leftCount: number;
  readonly rightCount: number;
};
export const generateBipartiteMatchingInstance = (
  leftCount: number,
  rightCount: number,
  probability: number,
  seed: string,
): BipartiteMatchingInstance | null => {
  if (!seed.trim()) return null;
  const random = createSeededRandom(seed);
  const edges: [number, number][] = [];
  for (let left = 0; left < leftCount; left += 1)
    for (let right = 0; right < rightCount; right += 1)
      if (random() < probability) edges.push([left, right]);
  return { edges, leftCount, rightCount };
};

export const bipartiteMatchingInstanceExample = {
  input: { leftCount: 3, probability: 0.4, rightCount: 3, seed: "tool.io" },
  output: {
    instance: {
      edges: [
        [0, 0],
        [0, 2],
        [1, 0],
      ],
      leftCount: 3,
      rightCount: 3,
    },
  },
} satisfies ToolExample<
  {
    readonly leftCount: number;
    readonly probability: number;
    readonly rightCount: number;
    readonly seed: string;
  },
  { readonly instance: BipartiteMatchingInstance }
>;

export const bipartiteMatchingInstanceTool = createSimpleTool({
  id: "generate/bipartite-matching-instance",
  title: "Bipartite Matching Instance Generator",
  description:
    "Generate a reproducible random bipartite graph for matching experiments.",
  inputs: [
    {
      id: "leftCount",
      kind: "integer",
      label: "Left vertices",
      maximum: 1_000,
      minimum: 1,
    },
    {
      id: "rightCount",
      kind: "integer",
      label: "Right vertices",
      maximum: 1_000,
      minimum: 1,
    },
    {
      format: "probability",
      id: "probability",
      kind: "number",
      label: "Edge probability",
      maximum: 1,
      minimum: 0,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "instance/bipartite-graph",
      id: "instance",
      kind: "object",
      label: "Instance",
    },
  ],
  calculate: (input) => {
    const instance = generateBipartiteMatchingInstance(
      input.leftCount as number,
      input.rightCount as number,
      input.probability as number,
      input.seed as string,
    );
    if (!instance) return simpleError("seed", "Enter a nonempty seed.");
    return { instance };
  },
});
export const runBipartiteMatchingInstance =
  bipartiteMatchingInstanceTool.execute;
export default bipartiteMatchingInstanceTool;
