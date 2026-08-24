import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BifoliumPerQuireSolverInput = {
  readonly quires?: number;
  readonly leavesPerQuire?: number;
};

export type BifoliumPerQuireSolverOutput = {
  readonly totalLeaves: number;
  readonly totalBifolia: number;
  readonly totalPages: number;
};

export const calculateBifoliumPerQuireSolver = (
  input: BifoliumPerQuireSolverInput,
): BifoliumPerQuireSolverOutput => {
  const quires = input.quires ?? 1;
  const leavesPerQuire = input.leavesPerQuire ?? 8;
  if (!(Number.isSafeInteger(quires) && quires >= 1))
    return simpleError(
      "quires",
      "Quire count must be a positive integer.",
      "invalid_quire",
    );
  if (
    !(Number.isSafeInteger(leavesPerQuire) && leavesPerQuire >= 2) ||
    leavesPerQuire % 2 !== 0
  )
    return simpleError(
      "leavesPerQuire",
      "Quires contain an even number of leaves of at least two.",
      "invalid_quire",
    );
  const totalLeaves = quires * leavesPerQuire;
  if (!Number.isSafeInteger(totalLeaves))
    return simpleError(
      "quires",
      "The total leaf count exceeds the safe integer range.",
      "numeric_range",
    );
  return {
    totalLeaves,
    totalBifolia: totalLeaves / 2,
    totalPages: totalLeaves * 2,
  };
};

export const bifoliumPerQuireSolverExample = {
  input: { quires: 2, leavesPerQuire: 8 },
  output: { totalLeaves: 16, totalBifolia: 8, totalPages: 32 },
} satisfies ToolExample<
  BifoliumPerQuireSolverInput,
  BifoliumPerQuireSolverOutput
>;

export const bifoliumPerQuireSolverTool = createSimpleTool({
  id: "paleography/bifolium-per-quire-solver",
  title: "Bifolium per Quire Solver",
  description:
    "Solve the exact quire arithmetic pages = 2 x leaves and bifolia = leaves / 2 for a run of equal-sized quires.",
  inputs: [
    {
      default: 1,
      description: "Number of identical quires.",
      id: "quires",
      kind: "integer",
      label: "Quires",
      minimum: 1,
    },
    {
      default: 8,
      description: "Even leaf count per full quire.",
      id: "leavesPerQuire",
      kind: "integer",
      label: "Leaves per quire",
      minimum: 2,
    },
  ],
  outputs: [
    {
      description: "Total leaves in the run of quires.",
      id: "totalLeaves",
      kind: "integer",
      label: "Total leaves",
    },
    {
      description: "Total folded sheets (bifolia).",
      id: "totalBifolia",
      kind: "integer",
      label: "Total bifolia",
    },
    {
      description: "Total written or blank pages.",
      id: "totalPages",
      kind: "integer",
      label: "Total pages",
    },
  ],
  calculate: (input) =>
    calculateBifoliumPerQuireSolver({
      leavesPerQuire: input.leavesPerQuire as number | undefined,
      quires: input.quires as number | undefined,
    }),
});

export const runBifoliumPerQuireSolver = bifoliumPerQuireSolverTool.execute;
export default bifoliumPerQuireSolverTool;
