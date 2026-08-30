import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WoodMovementExpansionInput = Readonly<{
  readonly initialWidthMm: number;
  readonly movementPerMoisturePoint: number;
  readonly moistureIncreasePoints: number;
}>;
export type WoodMovementExpansionOutput = Readonly<{
  readonly widthIncreaseMm: number;
}>;

export const calculateWoodMovementExpansion = (
  x: WoodMovementExpansionInput,
): WoodMovementExpansionOutput => {
  if (!Number.isFinite(x.initialWidthMm) || x.initialWidthMm < 0)
    simpleError("initialWidthMm", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.movementPerMoisturePoint) ||
    x.movementPerMoisturePoint < 0
  )
    simpleError(
      "movementPerMoisturePoint",
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
  const widthIncreaseMm =
    x.initialWidthMm * x.movementPerMoisturePoint * x.moistureIncreasePoints;
  if (!Number.isFinite(widthIncreaseMm))
    simpleError("widthIncreaseMm", "The inputs produce an invalid result.");
  return {
    widthIncreaseMm: Object.is(widthIncreaseMm, -0) ? 0 : widthIncreaseMm,
  };
};

export const example = {
  input: {
    initialWidthMm: 200,
    movementPerMoisturePoint: 0.002,
    moistureIncreasePoints: 5,
  },
  output: { widthIncreaseMm: 2 },
} satisfies ToolExample<
  WoodMovementExpansionInput,
  WoodMovementExpansionOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/wood-movement-expansion",
  title: "Wood Movement Expansion",
  description:
    "Estimate cross-grain wood expansion from starting board width, a species/orientation coefficient per moisture-content point, and moisture increase.",
  inputs: [
    {
      id: "initialWidthMm",
      kind: "number",
      label: "Starting board width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "movementPerMoisturePoint",
      kind: "number",
      label: "Movement coefficient",
      unit: "1/%MC",
      minimum: 0,
    },
    {
      id: "moistureIncreasePoints",
      kind: "number",
      label: "Moisture-content increase",
      unit: "percentage points",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "widthIncreaseMm",
      kind: "number",
      label: "Predicted cross-grain expansion",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateWoodMovementExpansion({
      initialWidthMm: input.initialWidthMm as number,
      movementPerMoisturePoint: input.movementPerMoisturePoint as number,
      moistureIncreasePoints: input.moistureIncreasePoints as number,
    }),
});
export const woodMovementExpansionTool = tool;
export const runWoodMovementExpansion = tool.execute;
export default tool;
