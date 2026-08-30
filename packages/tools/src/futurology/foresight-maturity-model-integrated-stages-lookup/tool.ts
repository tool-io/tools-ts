import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const stages = [
  {
    capabilities: [
      "occasional issue scanning",
      "informal narrative interpretation",
    ],
    name: "initial",
    purpose: "Recognize that futures work can inform decisions.",
  },
  {
    capabilities: ["repeatable horizon reviews", "documented signposts"],
    name: "repeatable",
    purpose: "Run consistent foresight practices on a regular cadence.",
  },
  {
    capabilities: [
      "defined methods",
      "shared assumptions and evidence practices",
    ],
    name: "defined",
    purpose: "Use shared methods and governance across teams.",
  },
  {
    capabilities: [
      "portfolio integration",
      "decision thresholds and feedback loops",
    ],
    name: "integrated",
    purpose: "Connect foresight evidence to strategy and decisions.",
  },
  {
    capabilities: ["adaptive learning", "portfolio-level transformation"],
    name: "adaptive",
    purpose: "Revise organizational choices as signals and conditions change.",
  },
] as const;

export type ForesightMaturityInput = {
  readonly maturityStage: number;
};

export type ForesightMaturityOutput = {
  readonly capabilities: ReadonlyArray<string>;
  readonly maturityStage: number;
  readonly nextStageFocus: string;
  readonly stageName: (typeof stages)[number]["name"];
  readonly stagePurpose: string;
};

export const lookupForesightMaturityStage = (
  input: ForesightMaturityInput,
): ForesightMaturityOutput => {
  if (
    !Number.isSafeInteger(input.maturityStage) ||
    input.maturityStage < 1 ||
    input.maturityStage > stages.length
  )
    simpleError(
      "maturityStage",
      "Maturity stage must be an integer from 1 through 5.",
      "maturity_stage_out_of_range",
    );
  const stageIndex = input.maturityStage - 1;
  const stage = stages[stageIndex]!;
  const nextStage = stages[stageIndex + 1];
  return {
    capabilities: [...stage.capabilities],
    maturityStage: input.maturityStage,
    nextStageFocus:
      nextStage === undefined
        ? "Sustain adaptive learning and reassess the stage as the environment changes."
        : `Develop the ${nextStage.name} stage capabilities: ${nextStage.capabilities.join(" and ")}.`,
    stageName: stage.name,
    stagePurpose: stage.purpose,
  };
};

export const foresightMaturityExample = {
  input: { maturityStage: 3 },
  output: {
    capabilities: [
      "defined methods",
      "shared assumptions and evidence practices",
    ],
    maturityStage: 3,
    nextStageFocus:
      "Develop the integrated stage capabilities: portfolio integration and decision thresholds and feedback loops.",
    stageName: "defined",
    stagePurpose: "Use shared methods and governance across teams.",
  },
} satisfies ToolExample<ForesightMaturityInput, ForesightMaturityOutput>;

export const foresightMaturityTool = createSimpleTool({
  calculate: (input) =>
    lookupForesightMaturityStage({
      maturityStage: input.maturityStage as number,
    }),
  description:
    "Look up the purpose, capabilities, and next-stage focus for a caller-selected foresight maturity stage.",
  id: "futurology/foresight-maturity-model-integrated-stages-lookup",
  inputs: [
    {
      id: "maturityStage",
      kind: "integer",
      label: "Maturity stage",
      maximum: 5,
      minimum: 1,
    },
  ],
  outputs: [
    { id: "capabilities", kind: "stringList", label: "Stage capabilities" },
    {
      id: "maturityStage",
      kind: "integer",
      label: "Maturity stage",
      maximum: 5,
      minimum: 1,
    },
    { id: "nextStageFocus", kind: "string", label: "Next-stage focus" },
    { id: "stageName", kind: "string", label: "Stage name" },
    { id: "stagePurpose", kind: "string", label: "Stage purpose" },
  ],
  title: "Foresight Maturity Model Integrated Stages Lookup",
});

export const runForesightMaturity = foresightMaturityTool.execute;
export default foresightMaturityTool;
