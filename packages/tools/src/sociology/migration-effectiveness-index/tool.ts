import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MigrationEffectivenessIndexInput = {
  readonly inflow: number;
  readonly outflow: number;
};

export type MigrationEffectivenessIndexOutput = {
  readonly effectivenessIndex: number;
};

export const migrationEffectivenessIndexExample = {
  input: {
    inflow: 800,
    outflow: 200,
  },
  output: {
    effectivenessIndex: 0.6,
  },
} satisfies ToolExample<
  MigrationEffectivenessIndexInput,
  MigrationEffectivenessIndexOutput
>;

export const calculateMigrationEffectiveness = (
  input: MigrationEffectivenessIndexInput,
): MigrationEffectivenessIndexOutput => {
  if (
    !Number.isFinite(input.inflow) ||
    !Number.isFinite(input.outflow) ||
    input.inflow < 0 ||
    input.outflow < 0
  )
    simpleError(
      "inflow",
      "Inflow and outflow must be finite nonnegative numbers.",
      "invalid_value",
    );
  const scale = Math.max(input.inflow, input.outflow);
  if (scale <= 0)
    simpleError(
      "inflow",
      "Gross migration must be positive to measure effectiveness.",
      "invalid_value",
    );
  return {
    effectivenessIndex:
      Math.abs(input.inflow / scale - input.outflow / scale) /
      (input.inflow / scale + input.outflow / scale),
  };
};

export const migrationEffectivenessIndexTool = createSimpleTool({
  calculate: (input) =>
    calculateMigrationEffectiveness({
      inflow: input.inflow as number,
      outflow: input.outflow as number,
    }),
  description:
    "Measure what share of gross migration actually changes the population with the migration effectiveness index.",
  id: "sociology/migration-effectiveness-index",
  inputs: [
    {
      description: "People moving into the region.",
      id: "inflow",
      kind: "number",
      label: "Inflow",
      minimum: 0,
    },
    {
      description: "People moving out of the region.",
      id: "outflow",
      kind: "number",
      label: "Outflow",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Absolute net flow over gross flow; zero means pure exchange.",
      id: "effectivenessIndex",
      kind: "number",
      label: "Effectiveness index",
    },
  ],
  title: "Migration Effectiveness Index Calculator",
});
export const runMigrationEffectivenessIndex =
  migrationEffectivenessIndexTool.execute;
export default migrationEffectivenessIndexTool;
