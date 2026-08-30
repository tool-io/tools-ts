import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CarrouselRotationInput = Readonly<{
  readonly periodSeconds: number;
}>;
export type CarrouselRotationOutput = Readonly<{
  readonly rotationsPerHour: number;
}>;

export const calculateCarrouselRotation = (
  x: CarrouselRotationInput,
): CarrouselRotationOutput => {
  if (!Number.isFinite(x.periodSeconds) || x.periodSeconds <= 0)
    simpleError("periodSeconds", "Provide a finite positive number.");
  const rotationsPerHour = 3600 / x.periodSeconds;
  if (!Number.isFinite(rotationsPerHour))
    simpleError(
      "rotationsPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    rotationsPerHour: Object.is(rotationsPerHour, -0) ? 0 : rotationsPerHour,
  };
};

export const example = {
  input: {
    periodSeconds: 60,
  },
  output: { rotationsPerHour: 60 },
} satisfies ToolExample<CarrouselRotationInput, CarrouselRotationOutput>;

export const tool = createSimpleTool({
  id: "horology/carrousel-rotation",
  title: "Carrousel Rotation",
  description:
    "Carrousel rotations per hour from its cage rotation period in seconds.",
  inputs: [
    {
      id: "periodSeconds",
      kind: "number",
      label: "Period Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "rotationsPerHour",
      kind: "number",
      label: "Rotations Per Hour",
      unit: "rev/h",
    },
  ],
  calculate: (input) =>
    calculateCarrouselRotation({
      periodSeconds: input.periodSeconds as number,
    }),
});
export const carrouselRotationTool = tool;
export const runCarrouselRotation = tool.execute;
export default tool;
