import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export type ThreeSatInstance = {
  readonly clauses: readonly (readonly [number, number, number])[];
  readonly variableCount: number;
};

export const generateThreeSatInstance = (
  variableCount: number,
  clauseCount: number,
  seed: string,
): ThreeSatInstance | null => {
  if (!seed.trim() || variableCount < 3) return null;
  const random = createSeededRandom(seed);
  const clauses = Array.from({ length: clauseCount }, () => {
    const variables = new Set<number>();
    while (variables.size < 3)
      variables.add(1 + Math.floor(random() * variableCount));
    return [...variables].map((variable) =>
      random() < 0.5 ? variable : -variable,
    ) as [number, number, number];
  });
  return { clauses, variableCount };
};

export const threeSatInstanceExample = {
  input: { clauseCount: 3, seed: "tool.io", variableCount: 5 },
  output: {
    instance: {
      clauses: [
        [1, -4, -2],
        [-5, 3, 4],
        [5, -4, 1],
      ],
      variableCount: 5,
    },
  },
} satisfies ToolExample<
  {
    readonly clauseCount: number;
    readonly seed: string;
    readonly variableCount: number;
  },
  { readonly instance: ThreeSatInstance }
>;

export const threeSatInstanceTool = createSimpleTool({
  id: "generate/3sat-instance",
  title: "3SAT Instance Generator",
  description:
    "Generate reproducible Boolean 3SAT clauses with distinct variables per clause.",
  inputs: [
    {
      id: "variableCount",
      kind: "integer",
      label: "Variable count",
      maximum: 100_000,
      minimum: 3,
    },
    {
      id: "clauseCount",
      kind: "integer",
      label: "Clause count",
      maximum: 100_000,
      minimum: 1,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "instance/3sat",
      id: "instance",
      kind: "object",
      label: "Instance",
    },
  ],
  calculate: (input) => {
    const instance = generateThreeSatInstance(
      input.variableCount as number,
      input.clauseCount as number,
      input.seed as string,
    );
    if (!instance)
      return simpleError(
        "seed",
        "Enter a nonempty seed and at least three variables.",
      );
    return { instance };
  },
});
export const runThreeSatInstance = threeSatInstanceTool.execute;
export default threeSatInstanceTool;
