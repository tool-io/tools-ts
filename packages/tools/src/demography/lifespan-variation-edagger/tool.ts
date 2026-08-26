import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LifespanVariationEdaggerInput = {
  readonly lx: readonly number[];
  readonly ex: readonly number[];
};

export type LifespanVariationEdaggerOutput = {
  readonly lifespanVariationEdagger: number;
};

export const calculateLifespanVariationEdagger = (
  input: LifespanVariationEdaggerInput,
): LifespanVariationEdaggerOutput => {
  const lx = input.lx;
  const ex = input.ex;
  if (lx.length < 2)
    simpleError(
      "lx",
      "Provide at least two survivorship values.",
      "invalid_list",
    );
  if (lx.length !== ex.length)
    simpleError(
      "ex",
      "The expectancy list must align with the survivorship list.",
      "invalid_list",
    );
  for (const value of lx)
    if (!(typeof value === "number" && Number.isFinite(value) && value > 0))
      simpleError(
        "lx",
        "Survivorship values must be finite and positive.",
        "invalid_list",
      );
  for (const value of ex)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "ex",
        "Expectancy values must be finite and non-negative.",
        "invalid_list",
      );
  let total = 0;
  for (let index = 0; index < lx.length; index += 1) {
    const deaths =
      index < lx.length - 1 ? lx[index]! - lx[index + 1]! : lx[index]!;
    if (!(deaths >= 0))
      simpleError(
        "lx",
        "Survivorship must be non-increasing across ages.",
        "invalid_list",
      );
    total += deaths * ex[index]!;
  }
  return { lifespanVariationEdagger: total };
};

export const lifespanVariationEdaggerExample = {
  input: { lx: [100, 90, 70, 40], ex: [3.1, 2.5, 1.8, 1.0] },
  output: { lifespanVariationEdagger: 175 },
} satisfies ToolExample<
  LifespanVariationEdaggerInput,
  LifespanVariationEdaggerOutput
>;

export const lifespanVariationEdaggerTool = createSimpleTool({
  id: "demography/lifespan-variation-edagger",
  title: "Lifespan Variation Edagger Calculator",
  description:
    "Compute Keyfitz' lifespan dispersion e-dagger as the death-weighted average of remaining life expectancy, summing d(x) times e(x) over aligned life-table columns with the final interval absorbing all remaining survivors.",
  inputs: [
    {
      description: "Survivors l(x) at each single age, non-increasing.",
      id: "lx",
      kind: "numberList",
      label: "l(x)",
    },
    {
      description: "Remaining life expectancy e(x) aligned with the survivors.",
      id: "ex",
      kind: "numberList",
      label: "e(x)",
    },
  ],
  outputs: [
    {
      description: "Lifespan variation e-dagger in years.",
      id: "lifespanVariationEdagger",
      kind: "number",
      label: "e-dagger",
    },
  ],
  calculate: (input) =>
    calculateLifespanVariationEdagger(
      input as unknown as LifespanVariationEdaggerInput,
    ),
});

export const runLifespanVariationEdagger = lifespanVariationEdaggerTool.execute;
export default lifespanVariationEdaggerTool;
