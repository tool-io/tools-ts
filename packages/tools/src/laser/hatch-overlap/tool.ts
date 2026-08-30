import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly beamDiameterMillimeters: number;
  readonly hatchSpacingMillimeters: number;
}>;
export type Output = Readonly<{
  readonly overlapPercent: number;
  readonly uncoveredGapMillimeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.beamDiameterMillimeters <= 0)
    simpleError(
      "beamDiameterMillimeters",
      "Beam diameter must be positive.",
      "invalid_diameter",
    );
  return {
    overlapPercent:
      (1 - input.hatchSpacingMillimeters / input.beamDiameterMillimeters) * 100,
    uncoveredGapMillimeters: Math.max(
      0,
      input.hatchSpacingMillimeters - input.beamDiameterMillimeters,
    ),
  };
};

export const exampleInput = {
  beamDiameterMillimeters: 0.1,
  hatchSpacingMillimeters: 0.08,
} satisfies Input;
export const exampleOutput = {
  overlapPercent: 20.000000000000007,
  uncoveredGapMillimeters: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      beamDiameterMillimeters: input.beamDiameterMillimeters as number,
      hatchSpacingMillimeters: input.hatchSpacingMillimeters as number,
    }),
  description:
    "Calculate adjacent hatch overlap from effective beam diameter and hatch spacing.",
  id: "laser/hatch-overlap",
  inputs: [
    {
      id: "beamDiameterMillimeters",
      label: "Effective beam diameter",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "hatchSpacingMillimeters",
      label: "Hatch spacing",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "overlapPercent",
      label: "Adjacent-track overlap",
      kind: "number",
      unit: "%",
    },
    {
      id: "uncoveredGapMillimeters",
      label: "Uncovered gap",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  title: "Hatch Overlap",
});

export const run = tool.execute;
export default tool;
