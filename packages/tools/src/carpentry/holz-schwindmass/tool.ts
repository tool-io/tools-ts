import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HolzSchwindmassInput = Readonly<{
  readonly initialWidthMillimeters: number;
  readonly initialMoisturePercent: number;
  readonly finalMoisturePercent: number;
  readonly movementPerPercentagePoint: number;
}>;
export type HolzSchwindmassOutput = Readonly<{
  readonly shrinkageMillimeters: number;
}>;

export const calculateHolzSchwindmass = (
  x: HolzSchwindmassInput,
): HolzSchwindmassOutput => {
  if (
    !Number.isFinite(x.initialWidthMillimeters) ||
    x.initialWidthMillimeters < 0
  )
    simpleError(
      "initialWidthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.initialMoisturePercent) ||
    x.initialMoisturePercent < 0
  )
    simpleError(
      "initialMoisturePercent",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.finalMoisturePercent) || x.finalMoisturePercent < 0)
    simpleError("finalMoisturePercent", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.movementPerPercentagePoint) ||
    x.movementPerPercentagePoint < 0
  )
    simpleError(
      "movementPerPercentagePoint",
      "Provide a finite number at least 0.",
    );
  if (x.finalMoisturePercent > x.initialMoisturePercent)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const shrinkageMillimeters =
    x.initialWidthMillimeters *
    (x.initialMoisturePercent - x.finalMoisturePercent) *
    x.movementPerPercentagePoint;
  if (!Number.isFinite(shrinkageMillimeters))
    simpleError(
      "shrinkageMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    shrinkageMillimeters: Object.is(shrinkageMillimeters, -0)
      ? 0
      : shrinkageMillimeters,
  };
};

export const example = {
  input: {
    initialWidthMillimeters: 200,
    initialMoisturePercent: 12,
    finalMoisturePercent: 8,
    movementPerPercentagePoint: 0.002,
  },
  output: { shrinkageMillimeters: 1.6 },
} satisfies ToolExample<HolzSchwindmassInput, HolzSchwindmassOutput>;

export const tool = createSimpleTool({
  id: "carpentry/holz-schwindmass",
  title: "Holz Schwindmass",
  description:
    "Expected across-grain wood shrinkage over a falling dry-basis moisture content, using a species- and direction-specific measured movement coefficient.",
  inputs: [
    {
      id: "initialWidthMillimeters",
      kind: "number",
      label: "Initial Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "initialMoisturePercent",
      kind: "number",
      label: "Initial Moisture Percent",
      unit: "%",
      minimum: 0,
    },
    {
      id: "finalMoisturePercent",
      kind: "number",
      label: "Final Moisture Percent",
      unit: "%",
      minimum: 0,
    },
    {
      id: "movementPerPercentagePoint",
      kind: "number",
      label: "Movement Per Percentage Point",
      unit: "1/%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "shrinkageMillimeters",
      kind: "number",
      label: "Shrinkage Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateHolzSchwindmass({
      initialWidthMillimeters: input.initialWidthMillimeters as number,
      initialMoisturePercent: input.initialMoisturePercent as number,
      finalMoisturePercent: input.finalMoisturePercent as number,
      movementPerPercentagePoint: input.movementPerPercentagePoint as number,
    }),
});
export const holzSchwindmassTool = tool;
export const runHolzSchwindmass = tool.execute;
export default tool;
