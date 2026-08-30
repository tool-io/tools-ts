import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly ringBoundaryRadiiM: readonly number[];
  readonly ringEmitterDischargesLitersPerHour: readonly number[];
  readonly fullRevolutionHours: number;
  readonly deliveredWaterFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly annularApplicationDepthsMm: readonly number[];
  readonly areaWeightedPivotDepthMm: number;
  readonly totalDeliveredPivotWaterM3: number;
}>;
const inputFields = [
  {
    id: "ringBoundaryRadiiM",
    label: "Ring boundary radii m",
    kind: "numberList",
  },
  {
    id: "ringEmitterDischargesLitersPerHour",
    label: "Ring emitter discharges liters per hour",
    kind: "numberList",
  },
  { id: "fullRevolutionHours", label: "Full revolution hours", kind: "number" },
  {
    id: "deliveredWaterFractions",
    label: "Delivered water fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.fullRevolutionHours, "fullRevolutionHours");
  input.ringBoundaryRadiiM.forEach((v) => nonnegative(v, "ringBoundaryRadiiM"));
  input.ringEmitterDischargesLitersPerHour.forEach((v) =>
    nonnegative(v, "ringEmitterDischargesLitersPerHour"),
  );
  input.deliveredWaterFractions.forEach((v) =>
    fraction(v, "deliveredWaterFractions"),
  );
  aligned(
    input.ringEmitterDischargesLitersPerHour,
    input.deliveredWaterFractions,
    "ringEmitterDischargesLitersPerHour",
  );
  ordered(input.ringBoundaryRadiiM, "ringBoundaryRadiiM");
  aligned(
    input.ringBoundaryRadiiM.slice(1),
    input.ringEmitterDischargesLitersPerHour,
    "rings",
  );
  const areas = input.ringBoundaryRadiiM
      .slice(1)
      .map(
        (r, i) =>
          Math.PI *
          (r - input.ringBoundaryRadiiM[i]) *
          (r + input.ringBoundaryRadiiM[i]),
      ),
    vol = input.ringEmitterDischargesLitersPerHour.map(
      (q, i) =>
        q * input.fullRevolutionHours * input.deliveredWaterFractions[i],
    ),
    total = vol.reduce((a, b) => a + b, 0);
  return {
    annularApplicationDepthsMm: vol.map((v, i) => v / areas[i]),
    areaWeightedPivotDepthMm: total / areas.reduce((a, b) => a + b, 0),
    totalDeliveredPivotWaterM3: total / 1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ringBoundaryRadiiM: [0, 10, 20],
  ringEmitterDischargesLitersPerHour: [100, 300],
  fullRevolutionHours: 1,
  deliveredWaterFractions: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  annularApplicationDepthsMm: [0.3183098861837907, 0.15915494309189535],
  areaWeightedPivotDepthMm: 0.1989436788648692,
  totalDeliveredPivotWaterM3: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/center-pivot-application-depth",
  title: "Agriculture Center Pivot Application Depth",
  description:
    "Inventory complete center-pivot revolution water by supplied nonoverlapping emitter annuli, retaining radial depth distribution/losses; no coordinate routing or uniform full-circle application assumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "annularApplicationDepthsMm",
      label: "Annular application depths mm",
      kind: "numberList",
    },
    {
      id: "areaWeightedPivotDepthMm",
      label: "Area weighted pivot depth mm",
      kind: "number",
    },
    {
      id: "totalDeliveredPivotWaterM3",
      label: "Total delivered pivot water m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ringBoundaryRadiiM: value.ringBoundaryRadiiM as readonly number[],
      ringEmitterDischargesLitersPerHour:
        value.ringEmitterDischargesLitersPerHour as readonly number[],
      fullRevolutionHours: value.fullRevolutionHours as number,
      deliveredWaterFractions:
        value.deliveredWaterFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
