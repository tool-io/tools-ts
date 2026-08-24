import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SimpsonIntegrationInput = {
  readonly values?: readonly number[];
  readonly xMin?: number;
  readonly xMax?: number;
};

export type SimpsonIntegrationOutput = {
  readonly integral: number;
  readonly deltaX: number;
};

export const calculateSimpsonIntegration = (
  input: SimpsonIntegrationInput,
): SimpsonIntegrationOutput => {
  const values = input.values ?? [0, 0.25, 1, 2.25, 4];
  const xMin = input.xMin ?? 0;
  const xMax = input.xMax ?? 2;
  const count = values.length;
  if (count < 3 || count % 2 === 0)
    return simpleError(
      "values",
      "Simpson's rule requires an odd number of samples (an even interval count).",
      "invalid_sample_count",
    );
  if (!(xMax > xMin))
    return simpleError(
      "xMax",
      "xMax must be greater than xMin.",
      "invalid_interval",
    );
  const deltaX = (xMax - xMin) / (count - 1);
  const oddSum = values
    .filter((_, index) => index % 2 === 1)
    .reduce((sum, y) => sum + y, 0);
  const interiorEvenSum = values
    .filter((_, index) => index % 2 === 0 && index > 0 && index < count - 1)
    .reduce((sum, y) => sum + y, 0);
  const integral =
    (deltaX / 3) *
    (values[0] + values[count - 1] + 4 * oddSum + 2 * interiorEvenSum);
  if (!Number.isFinite(integral))
    simpleError("values", "The integral exceeds the numeric range.");
  return { deltaX, integral };
};

export const simpsonIntegrationExample = {
  input: {
    values: [0, 0.25, 1, 2.25, 4],
    xMin: 0,
    xMax: 2,
  },
  output: {
    deltaX: 0.5,
    integral: 2.6666666666666665,
  },
} satisfies ToolExample<SimpsonIntegrationInput, SimpsonIntegrationOutput>;

export const simpsonIntegrationTool = createSimpleTool({
  id: "calculus/simpson-integration",
  title: "Simpson Integration Calculator",
  description:
    "Approximate a definite integral from evenly spaced samples over [xMin, xMax] using composite Simpson's rule (odd sample count required).",
  inputs: [
    {
      description:
        "Function samples at evenly spaced points, first at xMin and last at xMax; the count must be odd.",
      default: [0, 0.25, 1, 2.25, 4],
      id: "values",
      kind: "numberList",
      label: "Samples",
    },
    {
      description: "Lower integration bound.",
      default: 0,
      id: "xMin",
      kind: "number",
      label: "xMin",
    },
    {
      description: "Upper integration bound.",
      default: 2,
      id: "xMax",
      kind: "number",
      label: "xMax",
    },
  ],
  outputs: [
    {
      description: "Simpson approximation of the integral.",
      id: "integral",
      kind: "number",
      label: "Integral",
    },
    {
      description: "Sample spacing implied by the bounds.",
      id: "deltaX",
      kind: "number",
      label: "Delta x",
    },
  ],
  calculate: (input) =>
    calculateSimpsonIntegration({
      values: input.values as readonly number[],
      xMax: input.xMax as number,
      xMin: input.xMin as number,
    }),
});

export const runSimpsonIntegration = simpsonIntegrationTool.execute;
export default simpsonIntegrationTool;
