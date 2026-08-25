import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SkeletalHyphaeBandRaterInput = {
  readonly banding: "fully-banded" | "none" | "partial-thickening";
};

export type SkeletalHyphaeBandRaterOutput = {
  readonly banding: string;
};

export const skeletalHyphaeBandRaterExample = {
  input: { banding: "fully-banded" },
  output: { banding: "fully-banded" },
} satisfies ToolExample<
  SkeletalHyphaeBandRaterInput,
  SkeletalHyphaeBandRaterOutput
>;

export const skeletalHyphaeBandRaterTool = createSimpleTool({
  id: "mycology/skeletal-hyphae-band-rater",
  title: "Skeletal Band Rater",
  description:
    "Validate and record the observed skeletal-hypha banding state without assigning a nonstandard numeric severity score.",
  inputs: [
    {
      enum: ["none", "partial-thickening", "fully-banded"],
      id: "banding",
      kind: "string",
      label: "Banding",
    },
  ],
  outputs: [{ id: "banding", label: "Banding", kind: "string" }],
  calculate: (input) => ({
    banding: input.banding as string,
  }),
});
export const runSkeletalHyphaeBandRater = skeletalHyphaeBandRaterTool.execute;
export default skeletalHyphaeBandRaterTool;
