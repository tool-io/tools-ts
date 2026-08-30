import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoltGroupShearInput = Readonly<{
  readonly totalShearNewtons: number;
  readonly boltCount: number;
}>;
export type BoltGroupShearOutput = Readonly<{
  readonly shearPerBoltNewtons: number;
}>;

export const calculateBoltGroupShear = (
  x: BoltGroupShearInput,
): BoltGroupShearOutput => {
  if (!Number.isFinite(x.totalShearNewtons) || x.totalShearNewtons < 0)
    simpleError("totalShearNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.boltCount) || x.boltCount < 1)
    simpleError("boltCount", "Provide a finite number at least 1.");
  if (!Number.isSafeInteger(x.boltCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const shearPerBoltNewtons = x.totalShearNewtons / x.boltCount;
  if (!Number.isFinite(shearPerBoltNewtons))
    simpleError(
      "shearPerBoltNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    shearPerBoltNewtons: Object.is(shearPerBoltNewtons, -0)
      ? 0
      : shearPerBoltNewtons,
  };
};

export const example = {
  input: { totalShearNewtons: 10000, boltCount: 4 },
  output: { shearPerBoltNewtons: 2500 },
} satisfies ToolExample<BoltGroupShearInput, BoltGroupShearOutput>;

export const tool = createSimpleTool({
  id: "engineering/bolt-group-shear",
  title: "Bolt Group Shear",
  description:
    "Average direct shear force per bolt for a concentric load shared equally by identical bolts; excludes eccentricity and prying.",
  inputs: [
    {
      id: "totalShearNewtons",
      kind: "number",
      label: "Total Shear Newtons",
      unit: "N",
      minimum: 0,
    },
    { id: "boltCount", kind: "integer", label: "Bolt Count", minimum: 1 },
  ],
  outputs: [
    {
      id: "shearPerBoltNewtons",
      kind: "number",
      label: "Shear Per Bolt Newtons",
      unit: "N",
    },
  ],
  calculate: (input) =>
    calculateBoltGroupShear({
      totalShearNewtons: input.totalShearNewtons as number,
      boltCount: input.boltCount as number,
    }),
});
export const boltGroupShearTool = tool;
export const runBoltGroupShear = tool.execute;
export default tool;
