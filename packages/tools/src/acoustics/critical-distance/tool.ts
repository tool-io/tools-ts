import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CriticalDistanceInput = Readonly<{
  readonly directivityFactor: number;
  readonly roomConstantSquareMeters: number;
}>;
export type CriticalDistanceOutput = Readonly<{
  readonly criticalMeters: number;
}>;

export const calculateCriticalDistance = (
  x: CriticalDistanceInput,
): CriticalDistanceOutput => {
  if (!Number.isFinite(x.directivityFactor) || x.directivityFactor <= 0)
    simpleError("directivityFactor", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.roomConstantSquareMeters) ||
    x.roomConstantSquareMeters <= 0
  )
    simpleError(
      "roomConstantSquareMeters",
      "Provide a finite positive number.",
    );
  const criticalMeters = Math.sqrt(
    (x.directivityFactor * x.roomConstantSquareMeters) / (16 * Math.PI),
  );
  if (!Number.isFinite(criticalMeters))
    simpleError(
      "criticalMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { criticalMeters: Object.is(criticalMeters, -0) ? 0 : criticalMeters };
};

export const example = {
  input: {
    directivityFactor: 1,
    roomConstantSquareMeters: 100,
  },
  output: { criticalMeters: 1.4104739588693906 },
} satisfies ToolExample<CriticalDistanceInput, CriticalDistanceOutput>;

export const tool = createSimpleTool({
  id: "acoustics/critical-distance",
  title: "Critical Distance",
  description:
    "Diffuse-field critical distance sqrt(QR/16π) from source directivity and room constant R in m².",
  inputs: [
    {
      id: "directivityFactor",
      kind: "number",
      label: "Directivity Factor",
      minimum: 0,
    },
    {
      id: "roomConstantSquareMeters",
      kind: "number",
      label: "Room Constant Square Meters",
      unit: "m2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "criticalMeters",
      kind: "number",
      label: "Critical Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateCriticalDistance({
      directivityFactor: input.directivityFactor as number,
      roomConstantSquareMeters: input.roomConstantSquareMeters as number,
    }),
});
export const criticalDistanceTool = tool;
export const runCriticalDistance = tool.execute;
export default tool;
