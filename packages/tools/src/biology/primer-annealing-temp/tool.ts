import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const primerAnnealingTempExample = {
  input: { tmForwardC: 58, tmReverseC: 62 },
} satisfies ToolExample<{
  readonly tmForwardC: number;
  readonly tmReverseC: number;
}>;

export const primerAnnealingTempTool = createSimpleTool({
  id: "biology/primer-annealing-temp",
  title: "Annealing Temp Rule",
  description:
    "Estimate the PCR annealing temperature as the lower primer melting temperature minus five degrees.",
  inputs: [
    {
      id: "tmForwardC",
      label: "Forward primer Tm",
      kind: "number",
      unit: "°C",
    },
    {
      id: "tmReverseC",
      label: "Reverse primer Tm",
      kind: "number",
      unit: "°C",
    },
  ],
  outputs: [
    {
      id: "annealingTempC",
      label: "Annealing temperature",
      kind: "number",
      unit: "°C",
    },
  ],
  calculate: (input) => {
    const tmForwardC = input.tmForwardC as number;
    const tmReverseC = input.tmReverseC as number;
    return { annealingTempC: Math.min(tmForwardC, tmReverseC) - 5 };
  },
});
export const runPrimerAnnealingTemp = primerAnnealingTempTool.execute;
export default primerAnnealingTempTool;
