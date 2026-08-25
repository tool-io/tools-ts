import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ArbuscularColonizationPercentMethodInput = {
  readonly colonizedSegmentsInt: number;
  readonly totalSegmentsInt: number;
};

export type ArbuscularColonizationPercentMethodOutput = {
  readonly colonizationPercent: number;
};

export const arbuscularColonizationPercentMethodExample = {
  input: { colonizedSegmentsInt: 30, totalSegmentsInt: 80 },
  output: { colonizationPercent: 37.5 },
} satisfies ToolExample<
  ArbuscularColonizationPercentMethodInput,
  ArbuscularColonizationPercentMethodOutput
>;

export const calculateArbuscularColonizationPercentMethod = (
  input: ArbuscularColonizationPercentMethodInput,
): ArbuscularColonizationPercentMethodOutput => {
  if (
    !Number.isSafeInteger(input.totalSegmentsInt) ||
    input.totalSegmentsInt < 1
  )
    return simpleError(
      "totalSegmentsInt",
      "Total segments must be a positive integer.",
      "invalid_segments",
    );
  if (
    !Number.isSafeInteger(input.colonizedSegmentsInt) ||
    input.colonizedSegmentsInt < 0 ||
    input.colonizedSegmentsInt > input.totalSegmentsInt
  )
    return simpleError(
      "colonizedSegmentsInt",
      "Colonized segments must fall between zero and the total segment count.",
      "invalid_segments",
    );
  return {
    colonizationPercent:
      (input.colonizedSegmentsInt / input.totalSegmentsInt) * 100,
  };
};

export const arbuscularColonizationPercentMethodTool = createSimpleTool({
  id: "mycology/arbuscular-colonization-percent-method",
  title: "AM Colonization %",
  description:
    "Computes arbuscular mycorrhizal colonization as a percentage of viewed root segments.",
  inputs: [
    {
      id: "colonizedSegmentsInt",
      kind: "integer",
      label: "Colonized segments",
      minimum: 0,
    },
    {
      id: "totalSegmentsInt",
      kind: "integer",
      label: "Total segments",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "colonizationPercent",
      kind: "number",
      label: "Colonization percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateArbuscularColonizationPercentMethod({
      colonizedSegmentsInt: input.colonizedSegmentsInt as number,
      totalSegmentsInt: input.totalSegmentsInt as number,
    }),
});
export const runArbuscularColonizationPercentMethod =
  arbuscularColonizationPercentMethodTool.execute;
export default arbuscularColonizationPercentMethodTool;
