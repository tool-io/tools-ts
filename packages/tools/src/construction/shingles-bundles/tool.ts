import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShinglesBundlesInput = Readonly<{
  readonly roofAreaM2: number;
  readonly coveragePerBundleM2: number;
  readonly wastePercent: number;
}>;
export type ShinglesBundlesOutput = Readonly<{
  readonly bundleCount: number;
}>;

export const calculateShinglesBundles = (
  x: ShinglesBundlesInput,
): ShinglesBundlesOutput => {
  if (!Number.isFinite(x.roofAreaM2) || x.roofAreaM2 < 0)
    simpleError("roofAreaM2", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.coveragePerBundleM2) || x.coveragePerBundleM2 < 0)
    simpleError("coveragePerBundleM2", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  if (!(x.coveragePerBundleM2 > 0))
    simpleError("coveragePerBundleM2", "Coverage must be positive.");
  const bundleCount = Math.ceil(
    (x.roofAreaM2 * (1 + x.wastePercent / 100)) / x.coveragePerBundleM2,
  );
  if (!Number.isFinite(bundleCount) || !Number.isSafeInteger(bundleCount))
    simpleError("bundleCount", "The inputs produce an invalid result.");
  return { bundleCount: Object.is(bundleCount, -0) ? 0 : bundleCount };
};

export const example = {
  input: { roofAreaM2: 100, coveragePerBundleM2: 3, wastePercent: 10 },
  output: { bundleCount: 37 },
} satisfies ToolExample<ShinglesBundlesInput, ShinglesBundlesOutput>;

export const tool = createSimpleTool({
  id: "construction/shingles-bundles",
  title: "Shingles Bundles",
  description:
    "Round up shingle bundles required from sloped roof area, waste allowance, and coverage per bundle.",
  inputs: [
    {
      id: "roofAreaM2",
      kind: "number",
      label: "Sloped roof area",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "coveragePerBundleM2",
      kind: "number",
      label: "Coverage per bundle",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Waste allowance",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [{ id: "bundleCount", kind: "integer", label: "Bundles required" }],
  calculate: (input) =>
    calculateShinglesBundles({
      roofAreaM2: input.roofAreaM2 as number,
      coveragePerBundleM2: input.coveragePerBundleM2 as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const shinglesBundlesTool = tool;
export const runShinglesBundles = tool.execute;
export default tool;
