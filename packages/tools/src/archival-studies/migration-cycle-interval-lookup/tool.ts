import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MigrationCycleIntervalLookupInput = {
  readonly formatClass:
    | "text"
    | "still-image"
    | "moving-image"
    | "audio"
    | "database"
    | "email"
    | "geospatial";
};

export type MigrationCycleIntervalLookupOutput = {
  readonly intervalYears: number;
};

const INTERVAL_YEARS = {
  text: 10,
  "still-image": 7,
  "moving-image": 5,
  audio: 5,
  database: 5,
  email: 5,
  geospatial: 6,
} as const;

export const calculateMigrationCycleIntervalLookup = (
  input: MigrationCycleIntervalLookupInput,
): MigrationCycleIntervalLookupOutput => {
  if (!(input.formatClass in INTERVAL_YEARS))
    simpleError(
      "formatClass",
      "Format class is not in the local planning table.",
      "invalid_format_class",
    );
  return { intervalYears: INTERVAL_YEARS[input.formatClass] };
};

export const migrationCycleIntervalLookupExample = {
  input: { formatClass: "still-image" },
  output: { intervalYears: 7 },
} satisfies ToolExample<
  MigrationCycleIntervalLookupInput,
  MigrationCycleIntervalLookupOutput
>;

export const migrationCycleIntervalLookupTool = createSimpleTool({
  id: "archival-studies/migration-cycle-interval-lookup",
  title: "Migration Cycle Interval Years by Format Class Lookup",
  description:
    "Look up an illustrative local review-cycle interval by broad format class. These fixed values are planning defaults, not a preservation standard or a substitute for format-risk monitoring; migration should follow an institution's documented policy and evidence.",
  inputs: [
    {
      description: "Broad preservation class of the digital format.",
      enum: [
        "text",
        "still-image",
        "moving-image",
        "audio",
        "database",
        "email",
        "geospatial",
      ],
      id: "formatClass",
      kind: "string",
      label: "Format class",
    },
  ],
  outputs: [
    {
      description:
        "Illustrative years between policy reviews; not an automatic migration deadline.",
      id: "intervalYears",
      kind: "integer",
      label: "Interval (years)",
    },
  ],
  calculate: (input) =>
    calculateMigrationCycleIntervalLookup({
      formatClass:
        input.formatClass as MigrationCycleIntervalLookupInput["formatClass"],
    }),
});

export const runMigrationCycleIntervalLookup =
  migrationCycleIntervalLookupTool.execute;
export default migrationCycleIntervalLookupTool;
