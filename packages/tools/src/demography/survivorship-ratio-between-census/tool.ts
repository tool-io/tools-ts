import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SurvivorshipRatioBetweenCensusInput = {
  readonly lxStart: number;
  readonly lxLater: number;
};

export type SurvivorshipRatioBetweenCensusOutput = {
  readonly survivalRatio: number;
};

export const calculateSurvivorshipRatioBetweenCensus = (
  input: SurvivorshipRatioBetweenCensusInput,
): SurvivorshipRatioBetweenCensusOutput => {
  if (!(input.lxStart > 0))
    simpleError(
      "lxStart",
      "The starting life-table survivors must be greater than zero.",
      "invalid_lx",
    );
  if (!(input.lxLater >= 0))
    simpleError(
      "lxLater",
      "The later life-table survivors must be non-negative.",
      "invalid_lx",
    );
  if (input.lxLater > input.lxStart)
    simpleError(
      "lxLater",
      "Later life-table survivors cannot exceed survivors at the starting age.",
      "invalid_lx",
    );
  return { survivalRatio: input.lxLater / input.lxStart };
};

export const survivorshipRatioBetweenCensusExample = {
  input: { lxStart: 95000, lxLater: 92000 },
  output: { survivalRatio: 0.968421052631579 },
} satisfies ToolExample<
  SurvivorshipRatioBetweenCensusInput,
  SurvivorshipRatioBetweenCensusOutput
>;

export const survivorshipRatioBetweenCensusTool = createSimpleTool({
  id: "demography/survivorship-ratio-between-census",
  title: "Survivorship Ratio Between Census Calculator",
  description:
    "Compute the intercensal cohort survival ratio as the ratio of life-table survivors at the later age to survivors at the initial age.",
  inputs: [
    {
      description: "Life-table survivors l(x) at the initial age.",
      id: "lxStart",
      kind: "number",
      label: "l(x)",
      minimum: 0,
    },
    {
      description:
        "Life-table survivors l(x+t) at the later age reached by the cohort.",
      id: "lxLater",
      kind: "number",
      label: "l(x+t)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Survival ratio l(x+t) / l(x) used to project the cohort across the census interval.",
      id: "survivalRatio",
      kind: "number",
      label: "Survival ratio",
    },
  ],
  calculate: (input) =>
    calculateSurvivorshipRatioBetweenCensus(
      input as unknown as SurvivorshipRatioBetweenCensusInput,
    ),
});

export const runSurvivorshipRatioBetweenCensus =
  survivorshipRatioBetweenCensusTool.execute;
export default survivorshipRatioBetweenCensusTool;
