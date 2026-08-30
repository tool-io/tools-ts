import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ElectricalLoadDiversityInput = Readonly<{
  readonly sumIndividualPeaksWatts: number;
  readonly coincidentPeakWatts: number;
}>;
export type ElectricalLoadDiversityOutput = Readonly<{
  readonly diversityFactor: number;
}>;

export const calculateElectricalLoadDiversity = (
  x: ElectricalLoadDiversityInput,
): ElectricalLoadDiversityOutput => {
  if (
    !Number.isFinite(x.sumIndividualPeaksWatts) ||
    x.sumIndividualPeaksWatts < 0
  )
    simpleError(
      "sumIndividualPeaksWatts",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.coincidentPeakWatts) || x.coincidentPeakWatts < 0)
    simpleError("coincidentPeakWatts", "Provide a finite number at least 0.");
  if (x.coincidentPeakWatts > x.sumIndividualPeaksWatts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const diversityFactor = x.sumIndividualPeaksWatts / x.coincidentPeakWatts;
  if (!Number.isFinite(diversityFactor))
    simpleError(
      "diversityFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    diversityFactor: Object.is(diversityFactor, -0) ? 0 : diversityFactor,
  };
};

export const example = {
  input: { sumIndividualPeaksWatts: 20000, coincidentPeakWatts: 15000 },
  output: { diversityFactor: 1.3333333333333333 },
} satisfies ToolExample<
  ElectricalLoadDiversityInput,
  ElectricalLoadDiversityOutput
>;

export const tool = createSimpleTool({
  id: "engineering/electrical-load-diversity",
  title: "Electrical Load Diversity",
  description:
    "Electrical load diversity factor as sum of individual noncoincident peaks divided by coincident system peak.",
  inputs: [
    {
      id: "sumIndividualPeaksWatts",
      kind: "number",
      label: "Sum Individual Peaks Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "coincidentPeakWatts",
      kind: "number",
      label: "Coincident Peak Watts",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "diversityFactor", kind: "number", label: "Diversity Factor" },
  ],
  calculate: (input) =>
    calculateElectricalLoadDiversity({
      sumIndividualPeaksWatts: input.sumIndividualPeaksWatts as number,
      coincidentPeakWatts: input.coincidentPeakWatts as number,
    }),
});
export const electricalLoadDiversityTool = tool;
export const runElectricalLoadDiversity = tool.execute;
export default tool;
