import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HorizonCadenceInput = {
  readonly horizonLabels: ReadonlyArray<string>;
  readonly reviewCadence: string;
  readonly scanAreas: ReadonlyArray<string>;
  readonly teamName: string;
};

export type HorizonCadenceOutput = {
  readonly agendaItems: ReadonlyArray<string>;
  readonly cadenceCompletenessPercent: number;
  readonly reportTemplate: string;
  readonly totalAgendaItemCount: number;
};

export const buildHorizonScanningCadenceReport = (
  input: HorizonCadenceInput,
): HorizonCadenceOutput => {
  for (const [field, value] of [
    ["teamName", input.teamName],
    ["reviewCadence", input.reviewCadence],
  ] as const)
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        "Team name and review cadence must be nonempty strings.",
        "cadence_field_required",
      );
  for (const [field, values] of [
    ["horizonLabels", input.horizonLabels],
    ["scanAreas", input.scanAreas],
  ] as const) {
    if (!Array.isArray(values) || values.length === 0)
      simpleError(
        field,
        "At least one value is required.",
        "cadence_list_required",
      );
    for (const [index, value] of values.entries())
      if (typeof value !== "string" || value.trim() === "")
        simpleError(
          `${field}.${index}`,
          "List values must be nonempty strings.",
          "invalid_cadence_list_value",
        );
  }
  const scanAreas = input.scanAreas.map((area) => area.trim());
  const horizonLabels = input.horizonLabels.map((horizon) => horizon.trim());
  const agendaItems = scanAreas.flatMap((area) =>
    horizonLabels.map(
      (horizon) =>
        `Scan ${area} across the ${horizon} horizon for new signals and implications.`,
    ),
  );
  const cadenceCompletenessPercent = 100;
  return {
    agendaItems,
    cadenceCompletenessPercent,
    reportTemplate: `# ${input.teamName.trim()} horizon scan\nCadence: ${input.reviewCadence.trim()}\n\n## Agenda\n${agendaItems.map((item) => `- ${item}`).join("\n")}\n\n## Signals\n[to complete]\n## Implications\n[to complete]\n## Actions\n[to complete]`,
    totalAgendaItemCount: agendaItems.length,
  };
};

export const horizonCadenceExample = {
  input: {
    horizonLabels: ["0-2 years", "3-10 years"],
    reviewCadence: "Quarterly",
    scanAreas: ["Technology", "Regulation"],
    teamName: "Strategy Futures Team",
  },
  output: {
    agendaItems: [
      "Scan Technology across the 0-2 years horizon for new signals and implications.",
      "Scan Technology across the 3-10 years horizon for new signals and implications.",
      "Scan Regulation across the 0-2 years horizon for new signals and implications.",
      "Scan Regulation across the 3-10 years horizon for new signals and implications.",
    ],
    cadenceCompletenessPercent: 100,
    reportTemplate:
      "# Strategy Futures Team horizon scan\nCadence: Quarterly\n\n## Agenda\n- Scan Technology across the 0-2 years horizon for new signals and implications.\n- Scan Technology across the 3-10 years horizon for new signals and implications.\n- Scan Regulation across the 0-2 years horizon for new signals and implications.\n- Scan Regulation across the 3-10 years horizon for new signals and implications.\n\n## Signals\n[to complete]\n## Implications\n[to complete]\n## Actions\n[to complete]",
    totalAgendaItemCount: 4,
  },
} satisfies ToolExample<HorizonCadenceInput, HorizonCadenceOutput>;

export const horizonCadenceTool = createSimpleTool({
  calculate: (input) =>
    buildHorizonScanningCadenceReport({
      horizonLabels: input.horizonLabels as string[],
      reviewCadence: input.reviewCadence as string,
      scanAreas: input.scanAreas as string[],
      teamName: input.teamName as string,
    }),
  description:
    "Build a horizon-scanning agenda and report template from a team, cadence, scan areas, and horizon labels.",
  id: "futurology/horizon-scanning-team-cadence-report-template",
  inputs: [
    { id: "horizonLabels", kind: "stringList", label: "Horizon labels" },
    { id: "reviewCadence", kind: "string", label: "Review cadence" },
    { id: "scanAreas", kind: "stringList", label: "Scan areas" },
    { id: "teamName", kind: "string", label: "Team name" },
  ],
  outputs: [
    { id: "agendaItems", kind: "stringList", label: "Agenda items" },
    {
      id: "cadenceCompletenessPercent",
      kind: "number",
      label: "Agenda completeness percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    { id: "reportTemplate", kind: "string", label: "Report template" },
    {
      id: "totalAgendaItemCount",
      kind: "integer",
      label: "Agenda item count",
      minimum: 1,
    },
  ],
  title: "Horizon Scanning Team Cadence Report Template",
});

export const runHorizonCadence = horizonCadenceTool.execute;
export default horizonCadenceTool;
