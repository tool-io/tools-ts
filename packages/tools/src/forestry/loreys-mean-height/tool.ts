import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LoreysMeanHeightInput = Readonly<{
  readonly sumBasalAreaTimesHeight: number;
  readonly totalBasalAreaSquareMeters: number;
}>;
export type LoreysMeanHeightOutput = Readonly<{
  readonly meanHeightMeters: number;
}>;

export const calculateLoreysMeanHeight = (
  x: LoreysMeanHeightInput,
): LoreysMeanHeightOutput => {
  if (
    !Number.isFinite(x.sumBasalAreaTimesHeight) ||
    x.sumBasalAreaTimesHeight < 0
  )
    simpleError(
      "sumBasalAreaTimesHeight",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.totalBasalAreaSquareMeters) ||
    x.totalBasalAreaSquareMeters <= 0
  )
    simpleError(
      "totalBasalAreaSquareMeters",
      "Provide a finite positive number.",
    );
  const meanHeightMeters =
    x.sumBasalAreaTimesHeight / x.totalBasalAreaSquareMeters;
  if (!Number.isFinite(meanHeightMeters))
    simpleError(
      "meanHeightMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    meanHeightMeters: Object.is(meanHeightMeters, -0) ? 0 : meanHeightMeters,
  };
};

export const example = {
  input: {
    sumBasalAreaTimesHeight: 20,
    totalBasalAreaSquareMeters: 1,
  },
  output: { meanHeightMeters: 20 },
} satisfies ToolExample<LoreysMeanHeightInput, LoreysMeanHeightOutput>;

export const tool = createSimpleTool({
  id: "forestry/loreys-mean-height",
  title: "Loreys Mean Height",
  description:
    "Lorey's mean tree height, weighted by each tree's basal area, from aggregate basal-area-height and basal-area sums.",
  inputs: [
    {
      id: "sumBasalAreaTimesHeight",
      kind: "number",
      label: "Sum Basal Area Times Height",
      unit: "m3",
      minimum: 0,
    },
    {
      id: "totalBasalAreaSquareMeters",
      kind: "number",
      label: "Total Basal Area Square Meters",
      unit: "m2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "meanHeightMeters",
      kind: "number",
      label: "Mean Height Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateLoreysMeanHeight({
      sumBasalAreaTimesHeight: input.sumBasalAreaTimesHeight as number,
      totalBasalAreaSquareMeters: input.totalBasalAreaSquareMeters as number,
    }),
});
export const loreysMeanHeightTool = tool;
export const runLoreysMeanHeight = tool.execute;
export default tool;
