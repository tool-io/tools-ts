import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteVolumeInput = Readonly<{
  readonly lengthMeters: number;
  readonly widthMeters: number;
  readonly thicknessMeters: number;
}>;
export type ConcreteVolumeOutput = Readonly<{ volumeCubicMeters: number }>;

export const calculateConcreteVolume = (
  i: ConcreteVolumeInput,
): ConcreteVolumeOutput => {
  const value = i.lengthMeters * i.widthMeters * i.thicknessMeters;
  if (!Number.isFinite(value))
    simpleError("volumeCubicMeters", "The inputs produce a non-finite result.");
  return { volumeCubicMeters: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { lengthMeters: 5, widthMeters: 4, thicknessMeters: 0.15 },
  output: { volumeCubicMeters: 3 },
} satisfies ToolExample<ConcreteVolumeInput, ConcreteVolumeOutput>;

export const tool = createSimpleTool({
  id: "construction/concrete-volume",
  title: "Concrete Volume",
  description:
    "Calculate rectangular concrete volume in cubic meters from length, width, and pour thickness measured in meters.",
  inputs: [
    {
      id: "lengthMeters",
      kind: "number",
      label: "Length (m)",
      unit: "m",
      minimum: 0,
    },
    {
      id: "widthMeters",
      kind: "number",
      label: "Width (m)",
      unit: "m",
      minimum: 0,
    },
    {
      id: "thicknessMeters",
      kind: "number",
      label: "Thickness (m)",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "volumeCubicMeters",
      kind: "number",
      label: "Volume (m³)",
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateConcreteVolume({
      lengthMeters: input.lengthMeters as number,
      widthMeters: input.widthMeters as number,
      thicknessMeters: input.thicknessMeters as number,
    }),
});
export const concreteVolumeTool = tool;
export const runConcreteVolume = tool.execute;
export default tool;
