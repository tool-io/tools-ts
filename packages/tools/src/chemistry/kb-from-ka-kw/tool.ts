import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const kbFromKaKwExample = {
  input: { ka: 1.8e-5 },
} satisfies ToolExample<{
  readonly ka: number;
}>;

export const kbFromKaKwTool = createSimpleTool({
  id: "chemistry/kb-from-ka-kw",
  title: "Kb From Ka",
  description:
    "Compute the base dissociation constant from the acid dissociation constant as Kw divided by Ka.",
  inputs: [
    { id: "ka", label: "Acid dissociation constant Ka", kind: "number" },
  ],
  outputs: [
    { id: "kb", label: "Base dissociation constant Kb", kind: "number" },
  ],
  calculate: (input) => {
    const ka = input.ka as number;
    if (!(ka > 0)) simpleError("ka", "Ka must be positive.");
    return { kb: 1e-14 / ka };
  },
});
export const runKbFromKaKw = kbFromKaKwTool.execute;
export default kbFromKaKwTool;
