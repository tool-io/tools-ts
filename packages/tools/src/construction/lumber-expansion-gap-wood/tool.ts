import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LumberExpansionGapWoodInput = Readonly<{
  readonly widthMillimeters: number;
  readonly movementPerPercentagePoint: number;
  readonly moistureIncreasePoints: number;
}>;
export type LumberExpansionGapWoodOutput = Readonly<{
  readonly requiredGapMillimeters: number;
}>;

export const calculateLumberExpansionGapWood = (
  x: LumberExpansionGapWoodInput,
): LumberExpansionGapWoodOutput => {
  if (!Number.isFinite(x.widthMillimeters) || x.widthMillimeters < 0)
    simpleError("widthMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.movementPerPercentagePoint) ||
    x.movementPerPercentagePoint < 0
  )
    simpleError(
      "movementPerPercentagePoint",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.moistureIncreasePoints) ||
    x.moistureIncreasePoints < 0
  )
    simpleError(
      "moistureIncreasePoints",
      "Provide a finite number at least 0.",
    );
  const requiredGapMillimeters =
    x.widthMillimeters *
    x.movementPerPercentagePoint *
    x.moistureIncreasePoints;
  if (!Number.isFinite(requiredGapMillimeters))
    simpleError(
      "requiredGapMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    requiredGapMillimeters: Object.is(requiredGapMillimeters, -0)
      ? 0
      : requiredGapMillimeters,
  };
};

export const example = {
  input: {
    widthMillimeters: 200,
    movementPerPercentagePoint: 0.002,
    moistureIncreasePoints: 3,
  },
  output: { requiredGapMillimeters: 1.2000000000000002 },
} satisfies ToolExample<
  LumberExpansionGapWoodInput,
  LumberExpansionGapWoodOutput
>;

export const tool = createSimpleTool({
  id: "construction/lumber-expansion-gap-wood",
  title: "Lumber Expansion Gap Wood",
  description:
    "Allowance for predicted board expansion from width, a supplied across-grain movement coefficient and rise in moisture percentage points.",
  inputs: [
    {
      id: "widthMillimeters",
      kind: "number",
      label: "Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "movementPerPercentagePoint",
      kind: "number",
      label: "Movement Per Percentage Point",
      unit: "1/%",
      minimum: 0,
    },
    {
      id: "moistureIncreasePoints",
      kind: "number",
      label: "Moisture Increase Points",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "requiredGapMillimeters",
      kind: "number",
      label: "Required Gap Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateLumberExpansionGapWood({
      widthMillimeters: input.widthMillimeters as number,
      movementPerPercentagePoint: input.movementPerPercentagePoint as number,
      moistureIncreasePoints: input.moistureIncreasePoints as number,
    }),
});
export const lumberExpansionGapWoodTool = tool;
export const runLumberExpansionGapWood = tool.execute;
export default tool;
