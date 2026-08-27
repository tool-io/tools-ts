import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const restrictionFragmentLengthExample = {
  input: { cutSites: 4 },
} satisfies ToolExample<{
  readonly cutSites: number;
}>;

export const restrictionFragmentLengthTool = createSimpleTool({
  id: "biology/restriction-fragment-length",
  title: "Fragment Lengths Count",
  description:
    "Compute the number of DNA fragments produced by a number of restriction cut sites.",
  inputs: [{ id: "cutSites", label: "Cut sites", kind: "integer", minimum: 0 }],
  outputs: [{ id: "fragmentCount", label: "Fragment count", kind: "integer" }],
  calculate: (input) => ({
    fragmentCount: (input.cutSites as number) + 1,
  }),
});
export const runRestrictionFragmentLength =
  restrictionFragmentLengthTool.execute;
export default restrictionFragmentLengthTool;
