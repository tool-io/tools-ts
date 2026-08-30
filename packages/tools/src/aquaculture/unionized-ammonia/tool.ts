import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnionizedAmmoniaInput = Readonly<{
  readonly totalAmmoniaNitrogenMgPerLiter: number;
  readonly unionizedFractionPercent: number;
}>;
export type UnionizedAmmoniaOutput = Readonly<{
  readonly unionizedAmmoniaNitrogenMgPerLiter: number;
}>;

export const calculateUnionizedAmmonia = (
  x: UnionizedAmmoniaInput,
): UnionizedAmmoniaOutput => {
  if (
    !Number.isFinite(x.totalAmmoniaNitrogenMgPerLiter) ||
    x.totalAmmoniaNitrogenMgPerLiter < 0
  )
    simpleError(
      "totalAmmoniaNitrogenMgPerLiter",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.unionizedFractionPercent) ||
    x.unionizedFractionPercent < 0 ||
    x.unionizedFractionPercent > 100
  )
    simpleError(
      "unionizedFractionPercent",
      "Provide a finite nonnegative number no greater than 100.",
    );
  const unionizedAmmoniaNitrogenMgPerLiter =
    (x.totalAmmoniaNitrogenMgPerLiter * x.unionizedFractionPercent) / 100;
  if (!Number.isFinite(unionizedAmmoniaNitrogenMgPerLiter))
    simpleError(
      "unionizedAmmoniaNitrogenMgPerLiter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    unionizedAmmoniaNitrogenMgPerLiter: Object.is(
      unionizedAmmoniaNitrogenMgPerLiter,
      -0,
    )
      ? 0
      : unionizedAmmoniaNitrogenMgPerLiter,
  };
};

export const example = {
  input: {
    totalAmmoniaNitrogenMgPerLiter: 1,
    unionizedFractionPercent: 5,
  },
  output: { unionizedAmmoniaNitrogenMgPerLiter: 0.05 },
} satisfies ToolExample<UnionizedAmmoniaInput, UnionizedAmmoniaOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/unionized-ammonia",
  title: "Unionized Ammonia",
  description:
    "Apply a temperature-, pH-, and salinity-appropriate NH3 fraction to TAN. The result remains on a nitrogen-mass (NH3-N) basis, not molecular NH3 mass; obtain the fraction from a valid external model or table.",
  inputs: [
    {
      id: "totalAmmoniaNitrogenMgPerLiter",
      kind: "number",
      label: "Total Ammonia Nitrogen Mg Per Liter",
      unit: "mg/L",
    },
    {
      id: "unionizedFractionPercent",
      kind: "number",
      label: "Unionized Fraction Percent",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "unionizedAmmoniaNitrogenMgPerLiter",
      kind: "number",
      label: "Unionized Ammonia Nitrogen Mg Per Liter",
      unit: "mg/L",
    },
  ],
  calculate: (input) =>
    calculateUnionizedAmmonia({
      totalAmmoniaNitrogenMgPerLiter:
        input.totalAmmoniaNitrogenMgPerLiter as number,
      unionizedFractionPercent: input.unionizedFractionPercent as number,
    }),
});
export const runUnionizedAmmonia = tool.execute;
export default tool;
