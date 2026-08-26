import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LifetimeVsRecentMigrantRatioLookupInput = {
  readonly lifetimeMigrants: number;
  readonly recentMigrants: number;
};

export type LifetimeVsRecentMigrantRatioLookupOutput = {
  readonly ratio: number;
};

export const calculateLifetimeVsRecentMigrantRatioLookup = (
  input: LifetimeVsRecentMigrantRatioLookupInput,
): LifetimeVsRecentMigrantRatioLookupOutput => {
  if (!(input.lifetimeMigrants >= 0))
    simpleError(
      "lifetimeMigrants",
      "Lifetime migrants must be non-negative.",
      "invalid_count",
    );
  if (!(input.recentMigrants > 0))
    simpleError(
      "recentMigrants",
      "Recent migrants must be greater than zero to form a ratio.",
      "invalid_count",
    );
  return { ratio: input.lifetimeMigrants / input.recentMigrants };
};

export const lifetimeVsRecentMigrantRatioLookupExample = {
  input: { lifetimeMigrants: 45000, recentMigrants: 15000 },
  output: { ratio: 3 },
} satisfies ToolExample<
  LifetimeVsRecentMigrantRatioLookupInput,
  LifetimeVsRecentMigrantRatioLookupOutput
>;

export const lifetimeVsRecentMigrantRatioLookupTool = createSimpleTool({
  id: "demography/lifetime-vs-recent-migrant-ratio-lookup",
  title: "Lifetime Vs Recent Migrant Ratio Lookup",
  description:
    "Compare migration persistence by dividing lifetime migrants (born elsewhere) by recent migrants who moved within a stated interval.",
  inputs: [
    {
      description: "People born outside the current place of residence.",
      id: "lifetimeMigrants",
      kind: "number",
      label: "Lifetime",
      minimum: 0,
    },
    {
      description:
        "People living elsewhere at the start of the reference interval.",
      id: "recentMigrants",
      kind: "number",
      label: "Recent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Lifetime migrants per recent migrant.",
      id: "ratio",
      kind: "number",
      label: "Ratio",
    },
  ],
  calculate: (input) =>
    calculateLifetimeVsRecentMigrantRatioLookup(
      input as unknown as LifetimeVsRecentMigrantRatioLookupInput,
    ),
});

export const runLifetimeVsRecentMigrantRatioLookup =
  lifetimeVsRecentMigrantRatioLookupTool.execute;
export default lifetimeVsRecentMigrantRatioLookupTool;
