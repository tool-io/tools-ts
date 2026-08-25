import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const slimeMoldMigrationSpeedRaterExample = {
  input: { hoursElapsedInt: 8, migrationDistanceMm: 40 },
  output: { migrationSpeedMmPerHour: 5 },
} satisfies ToolExample<
  {
    readonly hoursElapsedInt: number;
    readonly migrationDistanceMm: number;
  },
  {
    readonly migrationSpeedMmPerHour: number;
  }
>;

export const slimeMoldMigrationSpeedRaterTool = createSimpleTool({
  id: "mycology/slime-mold-migration-speed-rater",
  title: "Slime Mold Speed",
  description:
    "Rate slime mold migration speed in millimeters per hour from migration distance divided by elapsed whole hours.",
  inputs: [
    {
      id: "migrationDistanceMm",
      label: "Migration distance",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "hoursElapsedInt",
      label: "Hours elapsed",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "migrationSpeedMmPerHour",
      label: "Migration speed",
      kind: "number",
      minimum: 0,
      unit: "mm/hour",
    },
  ],
  calculate: (input) => ({
    migrationSpeedMmPerHour:
      (input.migrationDistanceMm as number) / (input.hoursElapsedInt as number),
  }),
});
export const runSlimeMoldMigrationSpeedRater =
  slimeMoldMigrationSpeedRaterTool.execute;
export default slimeMoldMigrationSpeedRaterTool;
