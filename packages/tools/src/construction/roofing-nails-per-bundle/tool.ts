import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RoofingNailsPerBundleInput = Readonly<{
  readonly shinglesPerBundle: number;
  readonly nailsPerShingle: number;
}>;
export type RoofingNailsPerBundleOutput = Readonly<{
  readonly nailsPerBundle: number;
}>;

export const calculateRoofingNailsPerBundle = (
  x: RoofingNailsPerBundleInput,
): RoofingNailsPerBundleOutput => {
  if (!Number.isSafeInteger(x.shinglesPerBundle) || x.shinglesPerBundle < 0)
    simpleError("shinglesPerBundle", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.nailsPerShingle) || x.nailsPerShingle < 0)
    simpleError("nailsPerShingle", "Provide a safe integer at least 0.");
  const nailsPerBundle = x.shinglesPerBundle * x.nailsPerShingle;
  if (!Number.isFinite(nailsPerBundle) || !Number.isSafeInteger(nailsPerBundle))
    simpleError("nailsPerBundle", "The inputs produce an invalid result.");
  return { nailsPerBundle: Object.is(nailsPerBundle, -0) ? 0 : nailsPerBundle };
};

export const example = {
  input: { shinglesPerBundle: 29, nailsPerShingle: 4 },
  output: { nailsPerBundle: 116 },
} satisfies ToolExample<
  RoofingNailsPerBundleInput,
  RoofingNailsPerBundleOutput
>;

export const tool = createSimpleTool({
  id: "construction/roofing-nails-per-bundle",
  title: "Roofing Nails Per Bundle",
  description:
    "Estimate nails for one bundle from shingle count and the chosen fasteners-per-shingle installation pattern.",
  inputs: [
    {
      id: "shinglesPerBundle",
      kind: "integer",
      label: "Shingles per bundle",
      minimum: 0,
    },
    {
      id: "nailsPerShingle",
      kind: "integer",
      label: "Nails per shingle",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "nailsPerBundle", kind: "integer", label: "Nails per bundle" },
  ],
  calculate: (input) =>
    calculateRoofingNailsPerBundle({
      shinglesPerBundle: input.shinglesPerBundle as number,
      nailsPerShingle: input.nailsPerShingle as number,
    }),
});
export const roofingNailsPerBundleTool = tool;
export const runRoofingNailsPerBundle = tool.execute;
export default tool;
