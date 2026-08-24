import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScalingMilestone = {
  readonly milestoneNote: string;
  readonly powerKw: number;
  readonly year: number;
};

/** Representative published single-mode CW power milestones of Yb fiber lasers. */
export const SCALING_MILESTONES: readonly ScalingMilestone[] = [
  {
    milestoneNote: "IPG — first CW single-mode fiber laser.",
    powerKw: 0.11,
    year: 1999,
  },
  {
    milestoneNote:
      "Jeong et al. — first diffraction-limited kW-class fiber laser.",
    powerKw: 1.36,
    year: 2004,
  },
  {
    milestoneNote: "Multi-kW near-diffraction-limited demonstrations.",
    powerKw: 3,
    year: 2009,
  },
  {
    milestoneNote: "IPG announces a 10 kW single-mode fiber laser.",
    powerKw: 10,
    year: 2013,
  },
  {
    milestoneNote: "Commercial single-module systems reach the 20 kW class.",
    powerKw: 20,
    year: 2023,
  },
];

export const TMI_SCALING_LIMIT_NOTE =
  "Transverse mode instability (TMI) becomes the dominant scaling barrier beyond a few kW of near-diffraction-limited power.";

export type YtterbiumTimelineInput = {
  readonly year?: number;
};

export type YtterbiumTimelineOutput = {
  readonly beforeFirstDemonstration: boolean;
  readonly milestoneNote: string;
  readonly milestoneYear: number;
  readonly singleModePowerKw: number;
  readonly tmiScalingLimitNote: string;
};

export const ytterbiumScalingAtYear = (
  year: number,
): YtterbiumTimelineOutput => {
  if (year < 1999) {
    const first = SCALING_MILESTONES[0];
    return {
      beforeFirstDemonstration: true,
      milestoneNote: first.milestoneNote,
      milestoneYear: first.year,
      singleModePowerKw: first.powerKw,
      tmiScalingLimitNote: TMI_SCALING_LIMIT_NOTE,
    };
  }
  let selected = SCALING_MILESTONES[0];
  for (const milestone of SCALING_MILESTONES)
    if (milestone.year <= year && milestone.year >= selected.year)
      selected = milestone;
  return {
    beforeFirstDemonstration: false,
    milestoneNote: selected.milestoneNote,
    milestoneYear: selected.year,
    singleModePowerKw: selected.powerKw,
    tmiScalingLimitNote: TMI_SCALING_LIMIT_NOTE,
  };
};

export const ytterbiumScalingTimelineExample = {
  input: { year: 2013 },
  output: ytterbiumScalingAtYear(2013),
} satisfies ToolExample<YtterbiumTimelineInput, YtterbiumTimelineOutput>;

export const ytterbiumScalingTimelineTool = createSimpleTool({
  calculate: (input) => ytterbiumScalingAtYear(input.year as number),
  description:
    "Look up the latest entry at or before a year in this curated set of representative single-mode Yb-fiber power milestones. It is a compact engineering timeline, not an exhaustive record-claim database.",
  id: "laser/laser-ytterbium-fiber-single-mode-kilowatt-power-scaling-record-lookup",
  inputs: [
    {
      default: 2013,
      description: "Year whose state of the art should be reported.",
      id: "year",
      kind: "integer",
      label: "Year",
      maximum: 2100,
      minimum: 1990,
    },
  ],
  outputs: [
    {
      description: "Whether the year precedes all known demonstrations.",
      id: "beforeFirstDemonstration",
      kind: "boolean",
      label: "Before first demo",
    },
    {
      description: "Year of the milestone that was current at that date.",
      id: "milestoneYear",
      kind: "integer",
      label: "Milestone year",
    },
    {
      description: "Single-mode continuous-wave power of that milestone.",
      id: "singleModePowerKw",
      kind: "number",
      label: "Power",
      unit: "kW",
    },
    {
      description: "Description of the milestone.",
      id: "milestoneNote",
      kind: "string",
      label: "Milestone",
    },
    {
      description: "Standing note on the transverse mode instability barrier.",
      id: "tmiScalingLimitNote",
      kind: "string",
      label: "TMI limit note",
    },
  ],
  title: "Yb-Fiber Power Scaling Timeline",
});
export const runYtterbiumScalingTimeline = ytterbiumScalingTimelineTool.execute;
export default ytterbiumScalingTimelineTool;

export { ytterbiumScalingTimelineExample as example };
