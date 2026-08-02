import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const oddsRatioExample = {
  input: {
    controlEvent: 10,
    controlNoEvent: 90,
    exposedEvent: 20,
    exposedNoEvent: 80,
  },
} satisfies ToolExample<{
  readonly controlEvent: number;
  readonly controlNoEvent: number;
  readonly exposedEvent: number;
  readonly exposedNoEvent: number;
}>;

export const oddsRatioTool = createSimpleTool({
  id: "statistics/odds-ratio",
  title: "Odds Ratio Calculator",
  description: "Calculate an odds ratio from a two-by-two contingency table.",
  inputs: [
    {
      id: "exposedEvent",
      label: "Exposed events",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "exposedNoEvent",
      label: "Exposed non-events",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "controlEvent",
      label: "Control events",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "controlNoEvent",
      label: "Control non-events",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [{ id: "oddsRatio", label: "Odds ratio", kind: "number" }],
  calculate: (input) => {
    const denominator =
      (input.exposedNoEvent as number) * (input.controlEvent as number);
    if (denominator === 0)
      simpleError(
        "controlEvent",
        "The odds-ratio denominator must be nonzero.",
      );
    return {
      oddsRatio:
        ((input.exposedEvent as number) * (input.controlNoEvent as number)) /
        denominator,
    };
  },
});
export const runOddsRatio = oddsRatioTool.execute;
export default oddsRatioTool;
