import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    surfaceTensionNPerM: 0.072,
    contactAngleDeg: 0,
    densityKgPerM3: 1000,
    tubeRadiusM: 0.0005,
    gravityMPerS2: 9.80665,
  },
  output: { heightM: 0.029367826933764333 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/surface-tension-capillary-rise",
  title: "Capillary Rise from Surface Tension",
  description:
    "Estimate liquid rise in a circular capillary using Jurin's law, h = 2γ cosθ/(ρgr). A contact angle above 90° gives a negative height (depression). Assumes a narrow tube and ignores meniscus-shape corrections.",
  inputs: [
    {
      id: "surfaceTensionNPerM",
      kind: "number",
      label: "Surface tension (N/m)",
      minimum: 0,
    },
    {
      id: "contactAngleDeg",
      kind: "number",
      label: "Contact angle (deg)",
      minimum: 0,
    },
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Liquid density (kg/m³)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "tubeRadiusM",
      kind: "number",
      label: "Tube radius (m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "gravityMPerS2",
      kind: "number",
      label: "Gravity (m/s²)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "heightM", kind: "number", label: "Height M" }],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.contactAngleDeg > 180)
      simpleError(
        "contactAngleDeg",
        "Contact angle must be at most 180 degrees.",
      );
    const output = {
      heightM:
        (2 *
          i.surfaceTensionNPerM *
          Math.cos((i.contactAngleDeg * Math.PI) / 180)) /
        (i.densityKgPerM3 * i.gravityMPerS2 * i.tubeRadiusM),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type SurfaceTensionCapillaryRiseInput = Readonly<typeof example.input>;
export type SurfaceTensionCapillaryRiseOutput = Readonly<typeof example.output>;
export const surfaceTensionCapillaryRiseTool = tool;
export const runSurfaceTensionCapillaryRise = tool.execute;
export default tool;
