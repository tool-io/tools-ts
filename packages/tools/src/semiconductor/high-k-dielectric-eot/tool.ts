import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const SILICON_DIOXIDE_K = 3.9;

export type HighKDielectricEotInput = {
  readonly highKPermittivity: number;
  readonly highKThicknessNm: number;
};

export type HighKDielectricEotOutput = {
  readonly equivalentOxideThicknessNm: number;
};

export const highKDielectricEotExample = {
  input: { highKPermittivity: 25, highKThicknessNm: 10 },
  output: { equivalentOxideThicknessNm: 1.56 },
} satisfies ToolExample<HighKDielectricEotInput, HighKDielectricEotOutput>;

export const calculateHighKDielectricEot = (
  input: HighKDielectricEotInput,
): HighKDielectricEotOutput => {
  if (!Number.isFinite(input.highKPermittivity) || input.highKPermittivity <= 0)
    simpleError(
      "highKPermittivity",
      "Relative permittivity must be positive.",
      "invalid_permittivity",
    );
  if (!Number.isFinite(input.highKThicknessNm) || input.highKThicknessNm <= 0)
    simpleError(
      "highKThicknessNm",
      "Dielectric thickness must be positive.",
      "degenerate_input",
    );
  const equivalentOxideThicknessNm =
    (SILICON_DIOXIDE_K / input.highKPermittivity) * input.highKThicknessNm;
  if (
    !Number.isFinite(equivalentOxideThicknessNm) ||
    equivalentOxideThicknessNm <= 0
  )
    simpleError(
      "highKThicknessNm",
      "The equivalent oxide thickness is outside the representable range.",
      "numeric_range",
    );
  return { equivalentOxideThicknessNm };
};

export const highKDielectricEotTool = createSimpleTool({
  calculate: (input) =>
    calculateHighKDielectricEot({
      highKPermittivity: input.highKPermittivity as number,
      highKThicknessNm: input.highKThicknessNm as number,
    }),
  description:
    "Compute equivalent oxide thickness of a high-K gate dielectric relative to silicon dioxide.",
  id: "semiconductor/high-k-dielectric-eot",
  inputs: [
    {
      id: "highKPermittivity",
      kind: "number",
      label: "Relative permittivity",
      minimum: Number.MIN_VALUE,
      unit: "ratio",
    },
    {
      id: "highKThicknessNm",
      kind: "number",
      label: "Dielectric thickness",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "equivalentOxideThicknessNm",
      kind: "number",
      label: "Equivalent oxide thickness",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  title: "High-K EOT Calculator",
});
export const runHighKDielectricEot = highKDielectricEotTool.execute;
export default highKDielectricEotTool;
