import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RobustScenario = {
  readonly coefficient: number;
  readonly target: number;
};
export type RobustMinimaxInput = {
  readonly scenarios: readonly RobustScenario[];
};
export type RobustMinimaxSolution = {
  readonly decision: number;
  readonly evaluatedPoints: number;
  readonly worstCaseLoss: number;
};

const validScenarios = (input: unknown): input is RobustMinimaxInput => {
  if (
    typeof input !== "object" ||
    input === null ||
    !("scenarios" in input) ||
    !Array.isArray(input.scenarios) ||
    input.scenarios.length === 0
  )
    return false;
  return input.scenarios.every(
    (scenario) =>
      typeof scenario === "object" &&
      scenario !== null &&
      "coefficient" in scenario &&
      "target" in scenario &&
      typeof scenario.coefficient === "number" &&
      Number.isFinite(scenario.coefficient) &&
      typeof scenario.target === "number" &&
      Number.isFinite(scenario.target),
  );
};

export const solveRobustMinimax = (
  input: RobustMinimaxInput,
  minimum: number,
  maximum: number,
  step: number,
): RobustMinimaxSolution | null => {
  if (minimum > maximum || (maximum - minimum) / step > 1_000_000) return null;
  let bestDecision = minimum;
  let bestWorstLoss = Infinity;
  const count = Math.floor((maximum - minimum) / step) + 1;
  for (let index = 0; index < count; index += 1) {
    const decision = Math.min(maximum, minimum + index * step);
    const worstLoss = Math.max(
      ...input.scenarios.map(
        ({ coefficient, target }) => (coefficient * decision - target) ** 2,
      ),
    );
    if (worstLoss < bestWorstLoss) {
      bestWorstLoss = worstLoss;
      bestDecision = decision;
    }
  }
  return {
    decision: Number(bestDecision.toPrecision(12)),
    evaluatedPoints: count,
    worstCaseLoss: Number(bestWorstLoss.toPrecision(12)),
  };
};

export const robustMinimaxExample = {
  input: {
    maximum: 5,
    minimum: 0,
    scenarios: {
      scenarios: [
        { coefficient: 1, target: 2 },
        { coefficient: 2, target: 3 },
      ],
    },
    step: 0.01,
  },
  output: {
    solution: { decision: 1.66, evaluatedPoints: 501, worstCaseLoss: 0.1156 },
  },
} satisfies ToolExample<
  {
    readonly maximum: number;
    readonly minimum: number;
    readonly scenarios: RobustMinimaxInput;
    readonly step: number;
  },
  { readonly solution: RobustMinimaxSolution }
>;

export const robustMinimaxTool = createSimpleTool({
  id: "optimization/robust-minimax",
  title: "Robust Minimax Optimization Solver",
  description:
    "Find a one-dimensional decision that minimizes worst squared loss across supplied scenarios.",
  inputs: [
    {
      format: "optimization/scenarios",
      id: "scenarios",
      kind: "object",
      label: "Scenarios",
    },
    { id: "minimum", kind: "number", label: "Minimum decision" },
    { id: "maximum", kind: "number", label: "Maximum decision" },
    {
      id: "step",
      kind: "number",
      label: "Grid step",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "optimization/solution",
      id: "solution",
      kind: "object",
      label: "Robust solution",
    },
  ],
  calculate: (input) => {
    if (!validScenarios(input.scenarios))
      return simpleError(
        "scenarios",
        "Enter at least one finite coefficient and target.",
      );
    const solution = solveRobustMinimax(
      input.scenarios,
      input.minimum as number,
      input.maximum as number,
      input.step as number,
    );
    if (!solution)
      return simpleError(
        "step",
        "Enter ordered bounds and a feasible positive grid step.",
      );
    return { solution };
  },
});

export const runRobustMinimax = robustMinimaxTool.execute;
export default robustMinimaxTool;
