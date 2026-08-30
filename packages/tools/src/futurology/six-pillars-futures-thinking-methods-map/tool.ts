import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SixPillarsMapInput = {
  readonly activityMappings: ReadonlyArray<string>;
  readonly pillars: ReadonlyArray<string>;
};

export type SixPillarsMapOutput = {
  readonly completeCoverage: boolean;
  readonly mappedActivities: number;
  readonly missingPillars: ReadonlyArray<string>;
  readonly unmappedMappings: ReadonlyArray<string>;
};

export const mapSixPillarsActivities = (
  input: SixPillarsMapInput,
): SixPillarsMapOutput => {
  if (!Array.isArray(input.pillars) || input.pillars.length !== 6)
    simpleError(
      "pillars",
      "Exactly six pillar labels are required.",
      "six_pillars_required",
    );
  const normalizedPillars = input.pillars.map((pillar, index) => {
    if (typeof pillar !== "string" || pillar.trim() === "")
      simpleError(
        `pillars.${index}`,
        "Pillar labels must be nonempty strings.",
        "invalid_pillar",
      );
    return pillar.trim().toLowerCase();
  });
  if (new Set(normalizedPillars).size !== normalizedPillars.length)
    simpleError("pillars", "Pillar labels must be unique.", "duplicate_pillar");
  if (!Array.isArray(input.activityMappings))
    simpleError(
      "activityMappings",
      "Activity mappings must be an array.",
      "activity_mappings_required",
    );
  const covered = new Set<string>();
  const unmappedMappings: string[] = [];
  let mappedActivities = 0;
  for (const [index, mapping] of input.activityMappings.entries()) {
    if (typeof mapping !== "string" || !mapping.includes(":"))
      simpleError(
        `activityMappings.${index}`,
        "Mappings must use pillar:activity form.",
        "invalid_activity_mapping",
      );
    const [rawPillar, ...activityParts] = mapping.split(":");
    const pillar = rawPillar?.trim().toLowerCase();
    const activity = activityParts.join(":").trim();
    if (activity === "" || !normalizedPillars.includes(pillar ?? ""))
      unmappedMappings.push(mapping);
    else {
      covered.add(pillar!);
      mappedActivities += 1;
    }
  }
  const missingPillars = normalizedPillars.filter(
    (pillar) => !covered.has(pillar),
  );
  return {
    completeCoverage: missingPillars.length === 0,
    mappedActivities,
    missingPillars,
    unmappedMappings,
  };
};

export const sixPillarsMapExample = {
  input: {
    activityMappings: [
      "Challenge:assumptions",
      "Vision:scenarios",
      "Unknown:unmapped",
      "Act:actions",
    ],
    pillars: ["Challenge", "Vision", "Act", "Analyze", "Imagine", "Sense"],
  },
  output: {
    completeCoverage: false,
    mappedActivities: 3,
    missingPillars: ["analyze", "imagine", "sense"],
    unmappedMappings: ["Unknown:unmapped"],
  },
} satisfies ToolExample<SixPillarsMapInput, SixPillarsMapOutput>;

export const sixPillarsMapTool = createSimpleTool({
  calculate: (input) =>
    mapSixPillarsActivities({
      activityMappings: input.activityMappings as string[],
      pillars: input.pillars as string[],
    }),
  description:
    "Map pillar:activity labels to exactly six caller-supplied pillars and report missing pillars and unknown mappings.",
  id: "futurology/six-pillars-futures-thinking-methods-map",
  inputs: [
    {
      description: "Mappings in pillar:activity form.",
      id: "activityMappings",
      kind: "stringList",
      label: "Activity mappings",
    },
    {
      description: "Exactly six unique pillar labels.",
      id: "pillars",
      kind: "stringList",
      label: "Pillars",
    },
  ],
  outputs: [
    { id: "completeCoverage", kind: "boolean", label: "All pillars covered" },
    {
      id: "mappedActivities",
      kind: "integer",
      label: "Mapped activities",
      minimum: 0,
    },
    { id: "missingPillars", kind: "stringList", label: "Missing pillars" },
    {
      id: "unmappedMappings",
      kind: "stringList",
      label: "Unmapped activities",
    },
  ],
  title: "Six Pillars Futures Thinking Methods Map",
});

export const runSixPillarsMap = sixPillarsMapTool.execute;
export default sixPillarsMapTool;
