import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bValueStandardErrorShiBoltFormulaExample = {
  input: { bValue: 1, eventCount: 101 },
  output: { standardError: 0.22999999999999998, relativePercent: 23 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const bValueStandardErrorShiBoltFormulaTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ bValue, eventCount }) => {
      if (!(bValue > 0)) simpleError("bValue", "b-value must be positive.");
      if (eventCount <= 1)
        simpleError("eventCount", "Need at least two events.");
      const se = (2.3 * bValue ** 2) / Math.sqrt(eventCount - 1);
      return { standardError: se, relativePercent: (se / bValue) * 100 };
    })(input as never) as Record<string, unknown>,
  description:
    "Shi & Bolt (1982) b-value uncertainty, simplified for unit-variance magnitude residuals: σ_b = 2.30·b²/√(N−1); supply magnitude residuals for the full Σ(Mᵢ−M̄)² form.",
  id: "seismology/b-value-standard-error-shi-bolt-formula",
  inputs: [
    {
      minimum: 0,
      description: "Fitted b-value.",
      id: "bValue",
      kind: "number",
      label: "b",
    },
    {
      minimum: 2,
      description: "Events used in the fit.",
      id: "eventCount",
      kind: "integer",
      label: "N",
    },
  ],
  outputs: [
    {
      description: "One-sigma uncertainty on b.",
      id: "standardError",
      kind: "number",
      label: "σ_b",
    },
    {
      description: "Relative uncertainty.",
      id: "relativePercent",
      kind: "number",
      label: "σ%",
      unit: "%",
    },
  ],
  title: "B Value Standard Error Shi Bolt Formula",
});
export const runBValueStandardErrorShiBoltFormula =
  bValueStandardErrorShiBoltFormulaTool.execute;
export { bValueStandardErrorShiBoltFormulaExample as example };
export default bValueStandardErrorShiBoltFormulaTool;
