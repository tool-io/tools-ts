import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScienceFictionPrototypingInput = {
  readonly futureAssumption: string;
  readonly presentConstraint: string;
  readonly stakeholder: string;
  readonly timeHorizon: string;
};

export type ScienceFictionPrototypingOutput = {
  readonly narrative: string;
  readonly prototypePrompts: ReadonlyArray<string>;
  readonly testableAssumptions: ReadonlyArray<string>;
};

export const buildScienceFictionPrototypingNarrative = (
  input: ScienceFictionPrototypingInput,
): ScienceFictionPrototypingOutput => {
  for (const [field, value] of [
    ["futureAssumption", input.futureAssumption],
    ["presentConstraint", input.presentConstraint],
    ["stakeholder", input.stakeholder],
    ["timeHorizon", input.timeHorizon],
  ] as const)
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        "Prototyping fields must be nonempty strings.",
        "prototyping_field_required",
      );
  const futureAssumption = input.futureAssumption.trim();
  const presentConstraint = input.presentConstraint.trim();
  const stakeholder = input.stakeholder.trim();
  const timeHorizon = input.timeHorizon.trim();
  return {
    narrative: `In ${timeHorizon}, ${stakeholder} encounters a future where ${futureAssumption}, while ${presentConstraint}. The scene makes visible the choices, dependencies, and exclusions that the assumption creates.`,
    prototypePrompts: [
      `Stage a scene in which ${stakeholder} must act on ${futureAssumption}.`,
      `Show a normal day shaped by ${presentConstraint} without explaining the system directly.`,
      `Test how the scene changes if ${futureAssumption} is false.`,
    ],
    testableAssumptions: [
      futureAssumption,
      `${presentConstraint} remains material in the imagined setting.`,
    ],
  };
};

export const scienceFictionPrototypingExample = {
  input: {
    futureAssumption: "automated services are available on demand",
    presentConstraint: "trust is uneven across neighborhoods",
    stakeholder: "a community care coordinator",
    timeHorizon: "2040",
  },
  output: {
    narrative:
      "In 2040, a community care coordinator encounters a future where automated services are available on demand, while trust is uneven across neighborhoods. The scene makes visible the choices, dependencies, and exclusions that the assumption creates.",
    prototypePrompts: [
      "Stage a scene in which a community care coordinator must act on automated services are available on demand.",
      "Show a normal day shaped by trust is uneven across neighborhoods without explaining the system directly.",
      "Test how the scene changes if automated services are available on demand is false.",
    ],
    testableAssumptions: [
      "automated services are available on demand",
      "trust is uneven across neighborhoods remains material in the imagined setting.",
    ],
  },
} satisfies ToolExample<
  ScienceFictionPrototypingInput,
  ScienceFictionPrototypingOutput
>;

export const scienceFictionPrototypingTool = createSimpleTool({
  calculate: (input) =>
    buildScienceFictionPrototypingNarrative({
      futureAssumption: input.futureAssumption as string,
      presentConstraint: input.presentConstraint as string,
      stakeholder: input.stakeholder as string,
      timeHorizon: input.timeHorizon as string,
    }),
  description:
    "Turn a future assumption, present constraint, stakeholder, and horizon into a science-fiction prototyping narrative and tests.",
  id: "futurology/science-fiction-prototyping-narrative-method",
  inputs: [
    { id: "futureAssumption", kind: "string", label: "Future assumption" },
    { id: "presentConstraint", kind: "string", label: "Present constraint" },
    { id: "stakeholder", kind: "string", label: "Stakeholder" },
    { id: "timeHorizon", kind: "string", label: "Time horizon" },
  ],
  outputs: [
    { id: "narrative", kind: "string", label: "Prototyping narrative" },
    { id: "prototypePrompts", kind: "stringList", label: "Prototype prompts" },
    {
      id: "testableAssumptions",
      kind: "stringList",
      label: "Testable assumptions",
    },
  ],
  title: "Science Fiction Prototyping Narrative Method",
});

export const runScienceFictionPrototyping =
  scienceFictionPrototypingTool.execute;
export default scienceFictionPrototypingTool;
