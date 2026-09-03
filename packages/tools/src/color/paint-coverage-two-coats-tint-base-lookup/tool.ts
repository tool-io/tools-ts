import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedPaintableAreasM2: readonly number[];
  readonly callerTwoCoatUsableCoverageM2PerLiter: readonly number[];
  readonly callerIndependentWasteFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly conditionalRequiredPaintLiters: number;
}>;
const inputFields = [
  {
    id: "observedPaintableAreasM2",
    label: "Observed paintable areas m2",
    kind: "numberList",
  },
  {
    id: "callerTwoCoatUsableCoverageM2PerLiter",
    label: "Caller two coat usable coverage m2 per liter",
    kind: "numberList",
  },
  {
    id: "callerIndependentWasteFractions",
    label: "Caller independent waste fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerTwoCoatUsableCoverageM2PerLiter.forEach((v) =>
    positive(v, "callerTwoCoatUsableCoverageM2PerLiter"),
  );
  input.observedPaintableAreasM2.forEach((v) =>
    nonnegative(v, "observedPaintableAreasM2"),
  );
  input.callerIndependentWasteFractions.forEach((v) =>
    fraction(v, "callerIndependentWasteFractions"),
  );
  aligned(
    input.observedPaintableAreasM2,
    input.callerTwoCoatUsableCoverageM2PerLiter,
    "observedPaintableAreasM2",
  );
  aligned(
    input.observedPaintableAreasM2,
    input.callerIndependentWasteFractions,
    "observedPaintableAreasM2",
  );
  return {
    conditionalRequiredPaintLiters: sum(
      input.observedPaintableAreasM2.map(
        (v, i) =>
          (v / input.callerTwoCoatUsableCoverageM2PerLiter[i]) *
          (1 + input.callerIndependentWasteFractions[i]),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPaintableAreasM2: [10, 20],
  callerTwoCoatUsableCoverageM2PerLiter: [5, 10],
  callerIndependentWasteFractions: [0.1, 0],
} satisfies Input;
export const exampleOutput = {
  conditionalRequiredPaintLiters: 4.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/paint-coverage-two-coats-tint-base-lookup",
  title: "Paint Coverage Two Coats Tint Base Lookup",
  description:
    "Independent actual TWO COAT coverage calibration by tint base/substrate; no multiplying by two again or universal catalog coverage, caller additive purchase waste convention. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalRequiredPaintLiters",
      label: "Conditional required paint liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPaintableAreasM2:
        value.observedPaintableAreasM2 as readonly number[],
      callerTwoCoatUsableCoverageM2PerLiter:
        value.callerTwoCoatUsableCoverageM2PerLiter as readonly number[],
      callerIndependentWasteFractions:
        value.callerIndependentWasteFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
