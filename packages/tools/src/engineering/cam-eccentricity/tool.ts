import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CamEccentricityInput = Readonly<{
  readonly maximumRadiusMillimeters: number;
  readonly minimumRadiusMillimeters: number;
}>;
export type CamEccentricityOutput = Readonly<{
  readonly eccentricityMillimeters: number;
}>;

export const calculateCamEccentricity = (
  x: CamEccentricityInput,
): CamEccentricityOutput => {
  if (
    !Number.isFinite(x.maximumRadiusMillimeters) ||
    x.maximumRadiusMillimeters < 0
  )
    simpleError(
      "maximumRadiusMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.minimumRadiusMillimeters) ||
    x.minimumRadiusMillimeters < 0
  )
    simpleError(
      "minimumRadiusMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.maximumRadiusMillimeters < x.minimumRadiusMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const eccentricityMillimeters =
    (x.maximumRadiusMillimeters - x.minimumRadiusMillimeters) / 2;
  if (!Number.isFinite(eccentricityMillimeters))
    simpleError(
      "eccentricityMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    eccentricityMillimeters: Object.is(eccentricityMillimeters, -0)
      ? 0
      : eccentricityMillimeters,
  };
};

export const example = {
  input: { maximumRadiusMillimeters: 20, minimumRadiusMillimeters: 10 },
  output: { eccentricityMillimeters: 5 },
} satisfies ToolExample<CamEccentricityInput, CamEccentricityOutput>;

export const tool = createSimpleTool({
  id: "engineering/cam-eccentricity",
  title: "Cam Eccentricity",
  description:
    "Eccentricity of a disk cam from maximum and minimum measured radial distances to the rotation center.",
  inputs: [
    {
      id: "maximumRadiusMillimeters",
      kind: "number",
      label: "Maximum Radius Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "minimumRadiusMillimeters",
      kind: "number",
      label: "Minimum Radius Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "eccentricityMillimeters",
      kind: "number",
      label: "Eccentricity Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateCamEccentricity({
      maximumRadiusMillimeters: input.maximumRadiusMillimeters as number,
      minimumRadiusMillimeters: input.minimumRadiusMillimeters as number,
    }),
});
export const camEccentricityTool = tool;
export const runCamEccentricity = tool.execute;
export default tool;
