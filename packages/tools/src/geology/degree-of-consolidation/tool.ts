import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const TV_AT_SIXTY_PERCENT = (Math.PI / 4) * 0.6 * 0.6;

export type DegreeOfConsolidationInput = {
  readonly timeFactor: number;
};

export type DegreeOfConsolidationOutput = {
  readonly degreeOfConsolidationPercent: number;
};

export const calculateDegreeOfConsolidation = (
  input: DegreeOfConsolidationInput,
): DegreeOfConsolidationOutput => {
  if (!(input.timeFactor > 0))
    simpleError(
      "timeFactor",
      "Time factor must be greater than zero.",
      "invalid_time_factor",
    );
  if (!(input.timeFactor < 1.781))
    simpleError(
      "timeFactor",
      "Average degree of consolidation never reaches 100 percent; time factor must stay below 1.781.",
      "invalid_time_factor",
    );
  return {
    degreeOfConsolidationPercent:
      input.timeFactor <= TV_AT_SIXTY_PERCENT
        ? Math.sqrt((4 * input.timeFactor) / Math.PI) * 100
        : 100 - Math.pow(10, (1.781 - input.timeFactor) / 0.933),
  };
};

export const degreeOfConsolidationExample = {
  input: { timeFactor: 0.12566370614359172 },
  output: { degreeOfConsolidationPercent: 40 },
} satisfies ToolExample<
  DegreeOfConsolidationInput,
  DegreeOfConsolidationOutput
>;

export const degreeOfConsolidationTool = createSimpleTool({
  id: "geology/degree-of-consolidation",
  title: "Degree Of Consolidation Calculator",
  description:
    "Average degree of consolidation U inverted from the Terzaghi relations: Tv = (pi/4)*(U/100)^2 for U <= 60 percent and Tv = 1.781 - 0.933*log10(100 - U) for U > 60 percent.",
  inputs: [
    {
      description: "Time factor Tv, dimensionless, between 0 and 1.781.",
      id: "timeFactor",
      kind: "number",
      label: "Tv",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Average degree of consolidation U in percent.",
      id: "degreeOfConsolidationPercent",
      kind: "number",
      label: "U",
    },
  ],
  calculate: (input) =>
    calculateDegreeOfConsolidation(
      input as unknown as DegreeOfConsolidationInput,
    ),
});

export const runDegreeOfConsolidation = degreeOfConsolidationTool.execute;
export default degreeOfConsolidationTool;
