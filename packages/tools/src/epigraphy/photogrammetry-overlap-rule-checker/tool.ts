import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhotogrammetryOverlapRuleCheckerInput = {
  readonly forwardOverlapPercent: number;
  readonly sideOverlapPercent: number;
  readonly minimumForwardPercent?: number;
  readonly minimumSidePercent?: number;
};

export type PhotogrammetryOverlapRuleCheckerOutput = {
  readonly meetsRule: boolean;
  readonly forwardDeficitPercent: number;
  readonly sideDeficitPercent: number;
};

export const calculatePhotogrammetryOverlapRuleChecker = (
  input: PhotogrammetryOverlapRuleCheckerInput,
): PhotogrammetryOverlapRuleCheckerOutput => {
  const minimumForwardPercent = input.minimumForwardPercent ?? 60;
  const minimumSidePercent = input.minimumSidePercent ?? 20;
  const checks: ReadonlyArray<readonly [string, number]> = [
    ["forwardOverlapPercent", input.forwardOverlapPercent],
    ["sideOverlapPercent", input.sideOverlapPercent],
    ["minimumForwardPercent", minimumForwardPercent],
    ["minimumSidePercent", minimumSidePercent],
  ];
  for (const [field, value] of checks)
    if (!(value >= 0 && value <= 100))
      return simpleError(
        field,
        "Overlap percentages must lie between 0 and 100.",
        "invalid_percent",
      );
  const forwardDeficitPercent = Math.max(
    0,
    minimumForwardPercent - input.forwardOverlapPercent,
  );
  const sideDeficitPercent = Math.max(
    0,
    minimumSidePercent - input.sideOverlapPercent,
  );
  return {
    meetsRule: forwardDeficitPercent === 0 && sideDeficitPercent === 0,
    forwardDeficitPercent,
    sideDeficitPercent,
  };
};

export const photogrammetryOverlapRuleCheckerExample = {
  input: { forwardOverlapPercent: 80, sideOverlapPercent: 30 },
  output: { meetsRule: true, forwardDeficitPercent: 0, sideDeficitPercent: 0 },
} satisfies ToolExample<
  PhotogrammetryOverlapRuleCheckerInput,
  PhotogrammetryOverlapRuleCheckerOutput
>;

export const photogrammetryOverlapRuleCheckerTool = createSimpleTool({
  id: "epigraphy/photogrammetry-overlap-rule-checker",
  title: "Photogrammetry Overlap Percent Coverage Rule Checker",
  description:
    "Check whether image forward and side overlap percentages satisfy a coverage rule (defaults 60% forward, 20% side) and report any deficits.",
  inputs: [
    {
      description: "Forward overlap between consecutive images in percent.",
      id: "forwardOverlapPercent",
      kind: "number",
      label: "Forward overlap",
      maximum: 100,
      minimum: 0,
    },
    {
      description: "Side overlap between adjacent strips in percent.",
      id: "sideOverlapPercent",
      kind: "number",
      label: "Side overlap",
      maximum: 100,
      minimum: 0,
    },
    {
      default: 60,
      description: "Required forward overlap in percent.",
      id: "minimumForwardPercent",
      kind: "number",
      label: "Minimum forward",
      maximum: 100,
      minimum: 0,
    },
    {
      default: 20,
      description: "Required side overlap in percent.",
      id: "minimumSidePercent",
      kind: "number",
      label: "Minimum side",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "True when both overlaps meet their thresholds.",
      id: "meetsRule",
      kind: "boolean",
      label: "Meets rule",
    },
    {
      description:
        "Forward shortfall below the threshold in points of percent.",
      id: "forwardDeficitPercent",
      kind: "number",
      label: "Forward deficit",
    },
    {
      description: "Side shortfall below the threshold in points of percent.",
      id: "sideDeficitPercent",
      kind: "number",
      label: "Side deficit",
    },
  ],
  calculate: (input) =>
    calculatePhotogrammetryOverlapRuleChecker(
      input as unknown as PhotogrammetryOverlapRuleCheckerInput,
    ),
});

export const runPhotogrammetryOverlapRuleChecker =
  photogrammetryOverlapRuleCheckerTool.execute;
export default photogrammetryOverlapRuleCheckerTool;
