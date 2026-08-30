import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoltTensileCapacityInput = Readonly<{
  readonly tensileAreaSquareMillimeters: number;
  readonly allowableTensileMegapascals: number;
}>;
export type BoltTensileCapacityOutput = Readonly<{
  readonly allowableForceNewtons: number;
}>;

export const calculateBoltTensileCapacity = (
  x: BoltTensileCapacityInput,
): BoltTensileCapacityOutput => {
  if (
    !Number.isFinite(x.tensileAreaSquareMillimeters) ||
    x.tensileAreaSquareMillimeters < 0
  )
    simpleError(
      "tensileAreaSquareMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.allowableTensileMegapascals) ||
    x.allowableTensileMegapascals < 0
  )
    simpleError(
      "allowableTensileMegapascals",
      "Provide a finite number at least 0.",
    );
  const allowableForceNewtons =
    x.tensileAreaSquareMillimeters * x.allowableTensileMegapascals;
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
  input: {
    tensileAreaSquareMillimeters: 100,
    allowableTensileMegapascals: 200,
  },
  output: { allowableForceNewtons: 20000 },
} satisfies ToolExample<BoltTensileCapacityInput, BoltTensileCapacityOutput>;

export const tool = createSimpleTool({
  id: "engineering/bolt-tensile-capacity",
  title: "Bolt Tensile Capacity",
  description:
    "Nominal axial force from bolt tensile stress area times a user-supplied allowable tensile stress; excludes prying and interaction.",
  inputs: [
    {
      id: "tensileAreaSquareMillimeters",
      kind: "number",
      label: "Tensile Area Square Millimeters",
      unit: "mm²",
      minimum: 0,
    },
    {
      id: "allowableTensileMegapascals",
      kind: "number",
      label: "Allowable Tensile Megapascals",
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
    calculateBoltTensileCapacity({
      tensileAreaSquareMillimeters:
        input.tensileAreaSquareMillimeters as number,
      allowableTensileMegapascals: input.allowableTensileMegapascals as number,
    }),
});
export const boltTensileCapacityTool = tool;
export const runBoltTensileCapacity = tool.execute;
export default tool;
