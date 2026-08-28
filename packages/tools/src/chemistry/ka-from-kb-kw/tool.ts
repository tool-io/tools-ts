import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const kaFromKbKwExample = {
  input: { kb: 1.8e-5 },
} satisfies ToolExample<{
  readonly kb: number;
}>;

export const kaFromKbKwTool = createSimpleTool({
  id: "chemistry/ka-from-kb-kw",
  title: "Ka From Kb",
  description:
    "Compute the acid dissociation constant from the base dissociation constant as Kw divided by Kb.",
  inputs: [
    { id: "kb", label: "Base dissociation constant Kb", kind: "number" },
  ],
  outputs: [
    { id: "ka", label: "Acid dissociation constant Ka", kind: "number" },
  ],
  calculate: (input) => {
    const kb = input.kb as number;
    if (!(kb > 0)) simpleError("kb", "Kb must be positive.");
    return { ka: 1e-14 / kb };
  },
});
export const runKaFromKbKw = kaFromKbKwTool.execute;
export default kaFromKbKwTool;
