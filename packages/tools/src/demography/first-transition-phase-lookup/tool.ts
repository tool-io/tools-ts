import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FirstTransitionPhaseLookupInput = {
  readonly phase?: "stage-1" | "stage-2" | "stage-3" | "stage-4";
};

export type FirstTransitionPhaseLookupOutput = {
  readonly typicalCbrBand: string;
  readonly typicalCdrBand: string;
  readonly growthPattern: string;
  readonly hallmarkDescription: string;
};

const PHASE_TABLE: Record<
  "stage-1" | "stage-2" | "stage-3" | "stage-4",
  Omit<FirstTransitionPhaseLookupOutput, never>
> = {
  "stage-1": {
    typicalCbrBand: "high and fluctuating (roughly 30-40 per 1000)",
    typicalCdrBand: "high and fluctuating (roughly 30-40 per 1000)",
    growthPattern: "near-zero natural increase; population roughly stationary",
    hallmarkDescription:
      "Pre-industrial regime in which births are offset by mortality spikes from plague, famine and war.",
  },
  "stage-2": {
    typicalCbrBand: "still high (roughly 25-35 per 1000)",
    typicalCdrBand: "falling rapidly (from about 30 toward 10-15 per 1000)",
    growthPattern: "rapid and accelerating natural increase",
    hallmarkDescription:
      "Death rates fall as sanitation, food supply and medicine improve while birth rates stay high.",
  },
  "stage-3": {
    typicalCbrBand: "falling (roughly 15-25 per 1000)",
    typicalCdrBand: "low (around 10 per 1000)",
    growthPattern: "natural increase slowing as fertility declines",
    hallmarkDescription:
      "Urbanization, schooling and lower desired family size pull birth rates down toward death rates.",
  },
  "stage-4": {
    typicalCbrBand: "low (roughly 10-15 per 1000)",
    typicalCdrBand: "low (around 10 per 1000)",
    growthPattern: "near zero; population stable or slowly changing",
    hallmarkDescription:
      "Modern small-family regime; some textbooks append a stage 5 of below-replacement decline.",
  },
} as const;

export const calculateFirstTransitionPhaseLookup = (
  input: FirstTransitionPhaseLookupInput,
): FirstTransitionPhaseLookupOutput => PHASE_TABLE[input.phase ?? "stage-2"];

export const firstTransitionPhaseLookupExample = {
  input: { phase: "stage-2" },
  output: {
    typicalCbrBand: "still high (roughly 25-35 per 1000)",
    typicalCdrBand: "falling rapidly (from about 30 toward 10-15 per 1000)",
    growthPattern: "rapid and accelerating natural increase",
    hallmarkDescription:
      "Death rates fall as sanitation, food supply and medicine improve while birth rates stay high.",
  },
} satisfies ToolExample<
  FirstTransitionPhaseLookupInput,
  FirstTransitionPhaseLookupOutput
>;

export const firstTransitionPhaseLookupTool = createSimpleTool({
  id: "demography/first-transition-phase-lookup",
  title: "First Demographic Transition Phase Lookup",
  description:
    "Look up the textbook characteristics of a phase of the first demographic transition, with the conventional crude birth-rate and crude death-rate bands stated for each stage.",
  inputs: [
    {
      default: "stage-2",
      description: "Phase of the first demographic transition.",
      enum: ["stage-1", "stage-2", "stage-3", "stage-4"],
      id: "phase",
      kind: "string",
      label: "Phase",
    },
  ],
  outputs: [
    {
      description: "Conventional crude birth rate band for the phase.",
      id: "typicalCbrBand",
      kind: "string",
      label: "CBR band",
    },
    {
      description: "Conventional crude death rate band for the phase.",
      id: "typicalCdrBand",
      kind: "string",
      label: "CDR band",
    },
    {
      description: "Population growth behaviour of the phase.",
      id: "growthPattern",
      kind: "string",
      label: "Growth pattern",
    },
    {
      description: "One-line hallmark of the phase.",
      id: "hallmarkDescription",
      kind: "string",
      label: "Hallmark",
    },
  ],
  calculate: (input) =>
    calculateFirstTransitionPhaseLookup(
      input as unknown as FirstTransitionPhaseLookupInput,
    ),
});

export const runFirstTransitionPhaseLookup =
  firstTransitionPhaseLookupTool.execute;
export default firstTransitionPhaseLookupTool;
