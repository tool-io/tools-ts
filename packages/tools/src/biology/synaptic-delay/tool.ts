import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const synapticDelayExample = {
  input: { distanceUm: 100 },
  output: { synapticDelayMs: 2.5 },
} satisfies ToolExample<
  { readonly baseDelayMs?: number; readonly distanceUm: number },
  { readonly synapticDelayMs: number }
>;

export const synapticDelayTool = createSimpleTool({
  id: "biology/synaptic-delay",
  title: "Synaptic Delay Estimate",
  description:
    "Estimate total synaptic delay as a fixed base delay plus 0.02 milliseconds per micrometre of transmission distance.",
  inputs: [
    {
      description:
        "Transmission distance in micrometres; must not be negative.",
      id: "distanceUm",
      label: "Distance",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    {
      default: 0.5,
      description: "Fixed synaptic delay added before conduction.",
      id: "baseDelayMs",
      label: "Base delay",
      kind: "number",
      maximum: 5,
      minimum: 0,
      unit: "ms",
    },
  ],
  outputs: [
    {
      description: "Estimated synaptic delay in milliseconds.",
      id: "synapticDelayMs",
      label: "Synaptic delay",
      kind: "number",
      unit: "ms",
    },
  ],
  calculate: (input) => {
    const distanceUm = input.distanceUm as number;
    const baseDelayMs = input.baseDelayMs as number;
    return { synapticDelayMs: distanceUm * 0.02 + baseDelayMs };
  },
});
export const runSynapticDelay = synapticDelayTool.execute;
export default synapticDelayTool;
