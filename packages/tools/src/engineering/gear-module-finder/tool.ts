import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GearModuleFinderInput = Readonly<{
  readonly pitchDiameterMillimeters: number;
  readonly toothCount: number;
}>;
export type GearModuleFinderOutput = Readonly<{
  readonly moduleMillimeters: number;
}>;

export const calculateGearModuleFinder = (
  x: GearModuleFinderInput,
): GearModuleFinderOutput => {
  if (
    !Number.isFinite(x.pitchDiameterMillimeters) ||
    x.pitchDiameterMillimeters < 0
  )
    simpleError(
      "pitchDiameterMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.toothCount) || x.toothCount < 1)
    simpleError("toothCount", "Provide a finite number at least 1.");
  if (!Number.isSafeInteger(x.toothCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const moduleMillimeters = x.pitchDiameterMillimeters / x.toothCount;
  if (!Number.isFinite(moduleMillimeters))
    simpleError(
      "moduleMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    moduleMillimeters: Object.is(moduleMillimeters, -0) ? 0 : moduleMillimeters,
  };
};

export const example = {
  input: { pitchDiameterMillimeters: 100, toothCount: 20 },
  output: { moduleMillimeters: 5 },
} satisfies ToolExample<GearModuleFinderInput, GearModuleFinderOutput>;

export const tool = createSimpleTool({
  id: "engineering/gear-module-finder",
  title: "Gear Module Finder",
  description:
    "Metric spur-gear module m=d/z from pitch-circle diameter in millimeters and whole tooth count.",
  inputs: [
    {
      id: "pitchDiameterMillimeters",
      kind: "number",
      label: "Pitch Diameter Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "toothCount", kind: "integer", label: "Tooth Count", minimum: 1 },
  ],
  outputs: [
    {
      id: "moduleMillimeters",
      kind: "number",
      label: "Module Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateGearModuleFinder({
      pitchDiameterMillimeters: input.pitchDiameterMillimeters as number,
      toothCount: input.toothCount as number,
    }),
});
export const gearModuleFinderTool = tool;
export const runGearModuleFinder = tool.execute;
export default tool;
