import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  nonnegative,
  trapezoid,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualObservedElapsedSeconds: readonly number[];
  readonly actualBackgroundCorrectedConcentrationsMassPerVolume: readonly number[];
  readonly actualMatchedDischargesVolumePerSecond: readonly number[];
  readonly actualInjectedTracerMass: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedElapsedSeconds",
    label: "Actual observed elapsed seconds",
    kind: "numberList",
  },
  {
    id: "actualBackgroundCorrectedConcentrationsMassPerVolume",
    label: "Actual background corrected concentrations mass per volume",
    kind: "numberList",
  },
  {
    id: "actualMatchedDischargesVolumePerSecond",
    label: "Actual matched discharges volume per second",
    kind: "numberList",
  },
  {
    id: "actualInjectedTracerMass",
    label: "Actual injected tracer mass",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualObservedElapsedSeconds,
    input.actualMatchedDischargesVolumePerSecond,
    "trace",
  );
  input.actualBackgroundCorrectedConcentrationsMassPerVolume.forEach((v) =>
    nonnegative(v, "concentration"),
  );
  input.actualMatchedDischargesVolumePerSecond.forEach((v) =>
    nonnegative(v, "Q"),
  );
  positive(input.actualInjectedTracerMass, "injectedmass");
  const m = trapezoid(
    input.actualObservedElapsedSeconds,
    input.actualBackgroundCorrectedConcentrationsMassPerVolume.map(
      (v, i) => v * input.actualMatchedDischargesVolumePerSecond[i],
    ),
  );
  return {
    observedIntegratedRecoveredTracerMass: m,
    conditionalObservedRecoveryPercent:
      (100 * m) / input.actualInjectedTracerMass,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualObservedElapsedSeconds: [0, 1, 2],
    actualBackgroundCorrectedConcentrationsMassPerVolume: [0, 2, 0],
    actualMatchedDischargesVolumePerSecond: [1, 1, 1],
    actualInjectedTracerMass: 4,
  },
  output: {
    result: {
      observedIntegratedRecoveredTracerMass: 2,
      conditionalObservedRecoveryPercent: 50,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/dye-recovery-percent",
  title: "Dye Recovery Percentage Calculator",
  description:
    "Actual background-corrected dye concentration\u00d7matched discharge trapezoidal recovery integral/mass injected. Complete breakthrough collection, mixing and losses external; over100 percent retained as discrepancy, not forced to physical fraction.",
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
