import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SocialFluidityIndexGlassInput = {
  readonly countsMatrix: ReadonlyArray<readonly number[]>;
};

export type SocialFluidityIndexGlassOutput = {
  readonly fluidityOddsRatio: number;
};

export const socialFluidityIndexGlassExample = {
  input: {
    countsMatrix: [
      [90, 10],
      [40, 60],
    ],
  },
  output: {
    fluidityOddsRatio: 13.5,
  },
} satisfies ToolExample<
  SocialFluidityIndexGlassInput,
  SocialFluidityIndexGlassOutput
>;

export const calculateSocialFluidityIndex = (
  input: SocialFluidityIndexGlassInput,
): SocialFluidityIndexGlassOutput => {
  if (input.countsMatrix.length !== 2)
    simpleError(
      "countsMatrix",
      "The Glass odds ratio needs exactly two origin rows.",
      "invalid_shape",
    );
  const [rowA, rowB] = input.countsMatrix;
  if (!rowA || !rowB || rowA.length !== 2 || rowB.length !== 2)
    simpleError(
      "countsMatrix",
      "The Glass index needs a two-by-two origin-destination table.",
      "invalid_value",
    );
  const [a, b] = rowA;
  const [c, d] = rowB;
  if ([a, b, c, d].some((cell) => !Number.isFinite(cell) || cell < 0))
    simpleError(
      "countsMatrix",
      "Every mobility-table cell must be a finite nonnegative count.",
      "invalid_value",
    );
  if (b <= 0 || c <= 0)
    simpleError(
      "countsMatrix",
      "The off-diagonal cells must be positive to form the odds ratio.",
      "invalid_value",
    );
  const fluidityOddsRatio = (a / b) * (d / c);
  if (!Number.isFinite(fluidityOddsRatio))
    simpleError(
      "countsMatrix",
      "The class-association odds ratio is outside the finite numeric range.",
      "numeric_range",
    );
  return { fluidityOddsRatio };
};

export const socialFluidityIndexGlassTool = createSimpleTool({
  calculate: (input) =>
    calculateSocialFluidityIndex({
      countsMatrix: input.countsMatrix as ReadonlyArray<readonly number[]>,
    }),
  description:
    "Compute the cross-product association odds ratio for a two-by-two mobility table; larger values indicate stronger class persistence and therefore less social fluidity.",
  id: "sociology/social-fluidity-index-glass",
  inputs: [
    {
      description:
        "Two-by-two counts: inherited status and mobility into and out of the top category.",
      id: "countsMatrix",
      kind: "matrix",
      label: "Mobility counts",
    },
  ],
  outputs: [
    {
      description:
        "Association odds ratio; values above one mean inheritance outweighs exchange and imply lower fluidity.",
      id: "fluidityOddsRatio",
      kind: "number",
      label: "Class association odds ratio",
    },
  ],
  title: "Glass Social Fluidity Index Calculator",
});
export const runSocialFluidityIndexGlass = socialFluidityIndexGlassTool.execute;
export default socialFluidityIndexGlassTool;
