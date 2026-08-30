import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BodAquacultureInput = Readonly<{
  readonly initialOxygenMgPerLiter: number;
  readonly finalOxygenMgPerLiter: number;
  readonly sampleFraction: number;
}>;
export type BodAquacultureOutput = Readonly<{
  readonly bodMgPerLiter: number;
}>;

export const calculateBodAquaculture = (
  x: BodAquacultureInput,
): BodAquacultureOutput => {
  if (
    !Number.isFinite(x.initialOxygenMgPerLiter) ||
    x.initialOxygenMgPerLiter < 0
  )
    simpleError(
      "initialOxygenMgPerLiter",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.finalOxygenMgPerLiter) || x.finalOxygenMgPerLiter < 0)
    simpleError(
      "finalOxygenMgPerLiter",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.sampleFraction) ||
    x.sampleFraction < 0 ||
    x.sampleFraction > 1
  )
    simpleError(
      "sampleFraction",
      "Provide a finite nonnegative number no greater than 1.",
    );
  if (
    x.initialOxygenMgPerLiter < x.finalOxygenMgPerLiter ||
    x.sampleFraction <= 0
  )
    simpleError(
      "finalOxygenMgPerLiter",
      "Initial oxygen must be at least final oxygen, and dilution fraction must be positive.",
    );
  const bodMgPerLiter =
    (x.initialOxygenMgPerLiter - x.finalOxygenMgPerLiter) / x.sampleFraction;
  if (!Number.isFinite(bodMgPerLiter))
    simpleError(
      "bodMgPerLiter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { bodMgPerLiter: Object.is(bodMgPerLiter, -0) ? 0 : bodMgPerLiter };
};

export const example = {
  input: {
    initialOxygenMgPerLiter: 8,
    finalOxygenMgPerLiter: 4,
    sampleFraction: 0.5,
  },
  output: { bodMgPerLiter: 8 },
} satisfies ToolExample<BodAquacultureInput, BodAquacultureOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/bod-aquaculture",
  title: "BOD Aquaculture",
  description:
    "Compute oxygen demand from initial and final dissolved oxygen with the dilution fraction; incubation duration and controls must be specified externally.",
  inputs: [
    {
      id: "initialOxygenMgPerLiter",
      kind: "number",
      label: "Initial Oxygen Mg Per Liter",
      unit: "mg/L",
    },
    {
      id: "finalOxygenMgPerLiter",
      kind: "number",
      label: "Final Oxygen Mg Per Liter",
      unit: "mg/L",
    },
    {
      id: "sampleFraction",
      kind: "number",
      label: "Sample Fraction",
      unit: "ratio",
    },
  ],
  outputs: [
    {
      id: "bodMgPerLiter",
      kind: "number",
      label: "BOD Mg Per Liter",
      unit: "mg/L",
    },
  ],
  calculate: (input) =>
    calculateBodAquaculture({
      initialOxygenMgPerLiter: input.initialOxygenMgPerLiter as number,
      finalOxygenMgPerLiter: input.finalOxygenMgPerLiter as number,
      sampleFraction: input.sampleFraction as number,
    }),
});
export const runBodAquaculture = tool.execute;
export default tool;
