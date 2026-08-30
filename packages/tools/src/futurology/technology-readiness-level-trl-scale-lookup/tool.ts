import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const trlScale = [
  {
    description: "Basic principles are observed and reported.",
    name: "Basic Principles Observed and Reported",
    stage: "research",
  },
  {
    description: "A technology concept or application is formulated.",
    name: "Technology Concept or Application Formulated",
    stage: "concept",
  },
  {
    description:
      "Analytical and experimental critical-function or characteristic proof of concept is established.",
    name: "Critical-Function Proof of Concept",
    stage: "proof-of-concept",
  },
  {
    description:
      "A component or breadboard is validated in a laboratory environment.",
    name: "Component Validation in a Laboratory Environment",
    stage: "laboratory-validation",
  },
  {
    description:
      "A component or breadboard is validated in a relevant environment.",
    name: "Component Validation in a Relevant Environment",
    stage: "relevant-environment-validation",
  },
  {
    description:
      "A system or subsystem model or prototype is demonstrated in a relevant environment.",
    name: "System or Subsystem Prototype Demonstration",
    stage: "relevant-environment-demonstration",
  },
  {
    description:
      "A system prototype demonstrated in an operational environment.",
    name: "System Prototype Demonstration in an Operational Environment",
    stage: "system-prototype",
  },
  {
    description: "A complete and qualified system.",
    name: "System Complete and Qualified",
    stage: "qualification",
  },
  {
    description: "An actual system proven in operational use.",
    name: "Actual System Proven in Operational Use",
    stage: "proven",
  },
] as const;

export type TrlLookupInput = {
  readonly technologyReadinessLevel: number;
};

export type TrlLookupOutput = {
  readonly levelName: string;
  readonly readinessDescription: string;
  readonly stage: string;
  readonly technologyReadinessLevel: number;
};

export const lookupTechnologyReadinessLevel = (
  input: TrlLookupInput,
): TrlLookupOutput => {
  if (
    !Number.isSafeInteger(input.technologyReadinessLevel) ||
    input.technologyReadinessLevel < 1 ||
    input.technologyReadinessLevel > 9
  )
    simpleError(
      "technologyReadinessLevel",
      "Technology readiness level must be an integer from 1 through 9.",
      "technology_readiness_level_out_of_range",
    );
  const entry = trlScale[input.technologyReadinessLevel - 1]!;
  return {
    levelName: entry.name,
    readinessDescription: entry.description,
    stage: entry.stage,
    technologyReadinessLevel: input.technologyReadinessLevel,
  };
};

export const trlLookupExample = {
  input: { technologyReadinessLevel: 5 },
  output: {
    levelName: "Component Validation in a Relevant Environment",
    readinessDescription:
      "A component or breadboard is validated in a relevant environment.",
    stage: "relevant-environment-validation",
    technologyReadinessLevel: 5,
  },
} satisfies ToolExample<TrlLookupInput, TrlLookupOutput>;

export const trlLookupTool = createSimpleTool({
  calculate: (input) =>
    lookupTechnologyReadinessLevel({
      technologyReadinessLevel: input.technologyReadinessLevel as number,
    }),
  description:
    "Return the NASA technology maturity definition for a technology readiness level from TRL 1 through TRL 9.",
  id: "futurology/technology-readiness-level-trl-scale-lookup",
  inputs: [
    {
      id: "technologyReadinessLevel",
      kind: "integer",
      label: "Technology readiness level",
      maximum: 9,
      minimum: 1,
    },
  ],
  outputs: [
    { id: "levelName", kind: "string", label: "Level name" },
    {
      id: "readinessDescription",
      kind: "string",
      label: "Readiness description",
    },
    { id: "stage", kind: "string", label: "Readiness stage" },
    {
      id: "technologyReadinessLevel",
      kind: "integer",
      label: "Technology readiness level",
      maximum: 9,
      minimum: 1,
    },
  ],
  title: "Technology Readiness Level TRL Scale Lookup",
});

export const runTrlLookup = trlLookupTool.execute;
export default trlLookupTool;
