import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PressureInput = {
  readonly areaM2: number;
  readonly forceN: number;
};

export type PressureOutput = {
  readonly pressurePa: number;
};

export const pressureExample = {
  input: { forceN: 100, areaM2: 2 },
  output: { pressurePa: 50 },
} satisfies ToolExample<PressureInput, PressureOutput>;

export const pressureTool = createSimpleTool({
  id: "physics/pressure",
  title: "Pressure Calculator",
  description:
    "Compute pressure as force applied perpendicular to a surface divided by its area (P = F/A).",
  inputs: [
    {
      description:
        "Magnitude of the force applied perpendicular to the surface in newtons.",
      id: "forceN",
      label: "Force",
      kind: "number",
      unit: "N",
    },
    {
      description: "Area of the surface in square metres; must be positive.",
      id: "areaM2",
      label: "Area",
      kind: "number",
      unit: "m²",
    },
  ],
  outputs: [
    { id: "pressurePa", label: "Pressure", kind: "number", unit: "Pa" },
  ],
  calculate: (input) => {
    const area = input.areaM2 as number;
    if (area <= 0)
      simpleError(
        "areaM2",
        "The area must be greater than zero square metres.",
        "invalid_area",
      );
    return { pressurePa: (input.forceN as number) / area };
  },
});
export const runPressure = pressureTool.execute;
export default pressureTool;
