import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cellMigrationSpeedExample = {
  input: { distanceUm: 40, hoursElapsed: 5 },
  output: { migrationSpeedUmPerHour: 8 },
} satisfies ToolExample<
  { readonly distanceUm: number; readonly hoursElapsed: number },
  { readonly migrationSpeedUmPerHour: number }
>;

export const cellMigrationSpeedTool = createSimpleTool({
  id: "biology/cell-migration-speed",
  title: "Migration Speed",
  description:
    "Compute cell migration speed as distance traveled divided by hours elapsed.",
  inputs: [
    {
      id: "distanceUm",
      kind: "number",
      label: "Migration distance",
      minimum: 0,
      unit: "um",
    },
    {
      id: "hoursElapsed",
      kind: "number",
      label: "Hours elapsed",
    },
  ],
  outputs: [
    {
      id: "migrationSpeedUmPerHour",
      kind: "number",
      label: "Migration speed",
      unit: "um/hour",
    },
  ],
  calculate: (input) => {
    const distanceUm = input.distanceUm as number;
    const hoursElapsed = input.hoursElapsed as number;
    if (!(hoursElapsed > 0))
      simpleError("hoursElapsed", "Hours elapsed must be positive.");
    return { migrationSpeedUmPerHour: distanceUm / hoursElapsed };
  },
});
export const runCellMigrationSpeed = cellMigrationSpeedTool.execute;
export default cellMigrationSpeedTool;
