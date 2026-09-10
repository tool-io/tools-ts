import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  trapezoid,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualAlongPassageCoordinatesMeters: readonly number[];
  readonly actualMeasuredCrossSectionAreasSquareMeters: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAlongPassageCoordinatesMeters",
    label: "Actual along passage coordinates meters",
    kind: "numberList",
  },
  {
    id: "actualMeasuredCrossSectionAreasSquareMeters",
    label: "Actual measured cross section areas square meters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.actualMeasuredCrossSectionAreasSquareMeters.forEach((v) =>
    nonnegative(v, "area"),
  );
  return {
    conditionalTrapezoidalCaveVolumeCubicMeters: trapezoid(
      input.actualAlongPassageCoordinatesMeters,
      input.actualMeasuredCrossSectionAreasSquareMeters,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualAlongPassageCoordinatesMeters: [0, 2, 5],
    actualMeasuredCrossSectionAreasSquareMeters: [1, 2, 2],
  },
  output: { result: { conditionalTrapezoidalCaveVolumeCubicMeters: 9 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/volume-cross-section-integrator",
  title: "Cave Volume from Cross Sections Integrator",
  description:
    "Piecewise-linear cross-section cave-volume integration along actual independently defined centerline coordinates. Unmapped lobes and unsampled geometry external; not exact true volume.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
