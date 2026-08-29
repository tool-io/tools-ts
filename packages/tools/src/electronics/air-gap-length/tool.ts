import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    turns: 100,
    coreAreaM2: 0.0001,
    targetInductanceH: 0.001,
    corePathLengthM: 0.1,
    relativePermeability: 2000,
  },
  output: { airGapLengthM: 0.0012066370614359173 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/air-gap-length",
  title: "Magnetic Air Gap Length",
  description:
    "Solve a simple magnetic-circuit inductance model for required air-gap length: lg=μ₀N²A/L−lc/μr. This treats fringing and leakage as negligible; a negative result means the requested inductance needs no positive gap under the model.",
  inputs: [
    { id: "turns", kind: "integer", label: "Turns", minimum: 1 },
    {
      id: "coreAreaM2",
      kind: "number",
      label: "Core cross-section (m²)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "targetInductanceH",
      kind: "number",
      label: "Target inductance (H)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "corePathLengthM",
      kind: "number",
      label: "Core path length (m)",
      minimum: 0,
    },
    {
      id: "relativePermeability",
      kind: "number",
      label: "Core relative permeability",
      minimum: 1,
    },
  ],
  outputs: [{ id: "airGapLengthM", kind: "number", label: "Air Gap Length M" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      airGapLengthM:
        (4 * Math.PI * 1e-7 * i.turns * i.turns * i.coreAreaM2) /
          i.targetInductanceH -
        i.corePathLengthM / i.relativePermeability,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type AirGapLengthInput = Readonly<typeof example.input>;
export type AirGapLengthOutput = Readonly<typeof example.output>;
export const airGapLengthTool = tool;
export const runAirGapLength = tool.execute;
export default tool;
