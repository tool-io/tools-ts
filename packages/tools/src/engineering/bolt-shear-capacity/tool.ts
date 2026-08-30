import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoltShearCapacityInput = Readonly<{
  readonly shearAreaSquareMillimeters: number;
  readonly allowableShearMegapascals: number;
}>;
export type BoltShearCapacityOutput = Readonly<{
  readonly allowableForceNewtons: number;
}>;

export const calculateBoltShearCapacity = (
  x: BoltShearCapacityInput,
): BoltShearCapacityOutput => {
  if (
    !Number.isFinite(x.shearAreaSquareMillimeters) ||
    x.shearAreaSquareMillimeters < 0
  )
    simpleError(
      "shearAreaSquareMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.allowableShearMegapascals) ||
    x.allowableShearMegapascals < 0
  )
    simpleError(
      "allowableShearMegapascals",
      "Provide a finite number at least 0.",
    );
  const allowableForceNewtons =
    x.shearAreaSquareMillimeters * x.allowableShearMegapascals;
  if (!Number.isFinite(allowableForceNewtons))
    simpleError(
      "allowableForceNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    allowableForceNewtons: Object.is(allowableForceNewtons, -0)
      ? 0
      : allowableForceNewtons,
  };
};

export const example = {
  input: { shearAreaSquareMillimeters: 100, allowableShearMegapascals: 100 },
  output: { allowableForceNewtons: 10000 },
} satisfies ToolExample<BoltShearCapacityInput, BoltShearCapacityOutput>;

export const tool = createSimpleTool({
  id: "engineering/bolt-shear-capacity",
  title: "Bolt Shear Capacity",
  description:
    "Nominal single-shear force from bolt shear area times a user-supplied allowable shear stress; not a code-rated connection capacity.",
  inputs: [
    {
      id: "shearAreaSquareMillimeters",
      kind: "number",
      label: "Shear Area Square Millimeters",
      unit: "mm²",
      minimum: 0,
    },
    {
      id: "allowableShearMegapascals",
      kind: "number",
      label: "Allowable Shear Megapascals",
      unit: "MPa",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "allowableForceNewtons",
      kind: "number",
      label: "Allowable Force Newtons",
      unit: "N",
    },
  ],
  calculate: (input) =>
    calculateBoltShearCapacity({
      shearAreaSquareMillimeters: input.shearAreaSquareMillimeters as number,
      allowableShearMegapascals: input.allowableShearMegapascals as number,
    }),
});
export const boltShearCapacityTool = tool;
export const runBoltShearCapacity = tool.execute;
export default tool;
