import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nmrIntegrationRatioExample = {
  input: { integrationValueA: 3, integrationValueB: 2 },
  output: { protonRatioA: 1.5, protonRatioB: 1 },
} satisfies ToolExample<
  {
    readonly integrationValueA: number;
    readonly integrationValueB: number;
  },
  { readonly protonRatioA: number; readonly protonRatioB: number }
>;

export const nmrIntegrationRatioTool = createSimpleTool({
  id: "chemistry/nmr-integration-ratio",
  title: "Integration Ratio",
  description:
    "Normalize two NMR integrals so the smaller value becomes one and report the proton ratios rounded to two decimals.",
  inputs: [
    { id: "integrationValueA", label: "Integration A", kind: "number" },
    { id: "integrationValueB", label: "Integration B", kind: "number" },
  ],
  outputs: [
    { id: "protonRatioA", label: "Proton ratio A", kind: "number" },
    { id: "protonRatioB", label: "Proton ratio B", kind: "number" },
  ],
  calculate: (input) => {
    const integrationValueA = input.integrationValueA as number;
    const integrationValueB = input.integrationValueB as number;
    if (!(integrationValueA > 0))
      simpleError("integrationValueA", "Integration A must be positive.");
    if (!(integrationValueB > 0))
      simpleError("integrationValueB", "Integration B must be positive.");
    const minimum = Math.min(integrationValueA, integrationValueB);
    return {
      protonRatioA: Math.round((integrationValueA / minimum) * 100) / 100,
      protonRatioB: Math.round((integrationValueB / minimum) * 100) / 100,
    };
  },
});
export const runNmrIntegrationRatio = nmrIntegrationRatioTool.execute;
export default nmrIntegrationRatioTool;
