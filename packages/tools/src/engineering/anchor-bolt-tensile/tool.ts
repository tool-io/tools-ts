import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnchorBoltTensileInput = Readonly<{
  readonly totalTensionNewtons: number;
  readonly anchorCount: number;
}>;
export type AnchorBoltTensileOutput = Readonly<{
  readonly tensionPerAnchorNewtons: number;
}>;

export const calculateAnchorBoltTensile = (
  x: AnchorBoltTensileInput,
): AnchorBoltTensileOutput => {
  if (!Number.isFinite(x.totalTensionNewtons) || x.totalTensionNewtons < 0)
    simpleError("totalTensionNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.anchorCount) || x.anchorCount < 1)
    simpleError("anchorCount", "Provide a finite number at least 1.");
  if (!Number.isSafeInteger(x.anchorCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const tensionPerAnchorNewtons = x.totalTensionNewtons / x.anchorCount;
  if (!Number.isFinite(tensionPerAnchorNewtons))
    simpleError(
      "tensionPerAnchorNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    tensionPerAnchorNewtons: Object.is(tensionPerAnchorNewtons, -0)
      ? 0
      : tensionPerAnchorNewtons,
  };
};

export const example = {
  input: { totalTensionNewtons: 10000, anchorCount: 4 },
  output: { tensionPerAnchorNewtons: 2500 },
} satisfies ToolExample<AnchorBoltTensileInput, AnchorBoltTensileOutput>;

export const tool = createSimpleTool({
  id: "engineering/anchor-bolt-tensile",
  title: "Anchor Bolt Tensile",
  description:
    "Average direct tensile load per anchor under equal concentric load sharing; not an anchor design-strength calculation.",
  inputs: [
    {
      id: "totalTensionNewtons",
      kind: "number",
      label: "Total Tension Newtons",
      unit: "N",
      minimum: 0,
    },
    { id: "anchorCount", kind: "integer", label: "Anchor Count", minimum: 1 },
  ],
  outputs: [
    {
      id: "tensionPerAnchorNewtons",
      kind: "number",
      label: "Tension Per Anchor Newtons",
      unit: "N",
    },
  ],
  calculate: (input) =>
    calculateAnchorBoltTensile({
      totalTensionNewtons: input.totalTensionNewtons as number,
      anchorCount: input.anchorCount as number,
    }),
});
export const anchorBoltTensileTool = tool;
export const runAnchorBoltTensile = tool.execute;
export default tool;
