import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThinDiskAbsorptionInput = {
  readonly dopingAtomicPercent?: number;
  readonly thicknessMicrometers?: number;
  readonly sigmaAbsCm2?: number;
  readonly passes?: number;
  readonly overlapFraction?: number;
};

export type ThinDiskAbsorptionOutput = {
  readonly singlePassAbsorptionPercent: number;
  readonly totalAbsorptionPercent: number;
};

/** Ytterbium ion density of Yb:YAG per atomic percent. */
export const N_YB_PER_AT_PERCENT_CM3 = 1.38e20;

/**
 * A thin disk only absorbs a few percent per pass at 941 nm, so pump modules
 * recycle the light: total = 1 - (1 - f*eta_single)^passes.
 */
export const computeThinDiskAbsorption = (
  input: ThinDiskAbsorptionInput,
): ThinDiskAbsorptionOutput => {
  const dopingAtPercent = input.dopingAtomicPercent ?? 10;
  const thicknessCm = (input.thicknessMicrometers ?? 200) * 1e-4;
  const sigmaCm2 = input.sigmaAbsCm2 ?? 7e-21;
  const passes = input.passes ?? 24;
  const overlapFraction = input.overlapFraction ?? 0.9;
  if (dopingAtPercent <= 0)
    simpleError("dopingAtomicPercent", "Doping must be positive.");
  if (thicknessCm <= 0)
    simpleError("thicknessMicrometers", "Thickness must be positive.");
  if (sigmaCm2 <= 0)
    simpleError("sigmaAbsCm2", "Cross-section must be positive.");
  if (passes < 1 || !Number.isInteger(passes))
    simpleError("passes", "Pass count must be a whole number of at least one.");
  if (overlapFraction <= 0 || overlapFraction > 1)
    simpleError(
      "overlapFraction",
      "The pumped-area overlap fraction must lie in (0, 1].",
    );
  const opticalDepth =
    sigmaCm2 * N_YB_PER_AT_PERCENT_CM3 * dopingAtPercent * thicknessCm;
  const singlePass = -Math.expm1(-opticalDepth);
  const effectivePerPass = singlePass * overlapFraction;
  return {
    singlePassAbsorptionPercent: singlePass * 100,
    totalAbsorptionPercent:
      -Math.expm1(passes * Math.log1p(-effectivePerPass)) * 100,
  };
};

export const thinDiskAbsorptionExample = {
  input: {},
  output: computeThinDiskAbsorption({}),
} satisfies ToolExample<ThinDiskAbsorptionInput, ThinDiskAbsorptionOutput>;

export const thinDiskAbsorptionTool = createSimpleTool({
  calculate: (input) =>
    computeThinDiskAbsorption({
      dopingAtomicPercent: input.dopingAtomicPercent as number,
      overlapFraction: input.overlapFraction as number,
      passes: input.passes as number,
      sigmaAbsCm2: input.sigmaAbsCm2 as number,
      thicknessMicrometers: input.thicknessMicrometers as number,
    }),
  description:
    "Compute single-pass and multipass pump absorption of an Yb:YAG thin disk for the given doping, thickness and pass count.",
  id: "laser/laser-yb-yag-thin-disk-multipass-pump-absorption-efficiency-calculator",
  inputs: [
    {
      description: "Ytterbium doping of the disk.",
      default: 10,
      id: "dopingAtomicPercent",
      kind: "number",
      label: "Doping",
      minimum: 0,
      unit: "at.%",
    },
    {
      description: "Disk thickness.",
      default: 200,
      id: "thicknessMicrometers",
      kind: "number",
      label: "Thickness",
      minimum: 0,
      unit: "µm",
    },
    {
      description: "Pump absorption cross-section at 941 nm.",
      default: 7e-21,
      id: "sigmaAbsCm2",
      kind: "number",
      label: "σ_abs",
      minimum: 0,
      unit: "cm²",
    },
    {
      description: "Number of times the pump traverses the disk.",
      default: 24,
      id: "passes",
      kind: "integer",
      label: "Pump passes",
      minimum: 1,
    },
    {
      description:
        "Fraction of the pump that overlaps the doped spot each pass.",
      default: 0.9,
      id: "overlapFraction",
      kind: "number",
      label: "Overlap fraction",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Absorption of one transit through the disk.",
      id: "singlePassAbsorptionPercent",
      kind: "number",
      label: "Single pass",
      unit: "%",
    },
    {
      description: "Absorption accumulated over all passes.",
      id: "totalAbsorptionPercent",
      kind: "number",
      label: "Total absorption",
      unit: "%",
    },
  ],
  title: "Yb:YAG Thin-Disk Multipass Absorption",
});
export const runThinDiskAbsorption = thinDiskAbsorptionTool.execute;
export default thinDiskAbsorptionTool;

export { thinDiskAbsorptionExample as example };
