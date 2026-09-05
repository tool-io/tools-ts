import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  strictlyIncreasing,
  crossings,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedDepthsM: readonly number[];
  readonly measuredTemperatureC: readonly number[];
  readonly callerMatchedHydrateBoundaryC: readonly number[];
}>;
export type Output = Readonly<{
  readonly stableObservedThicknessM: number;
  readonly observedBoundaryDepthsM: readonly number[];
}>;
const inputFields = [
  { id: "observedDepthsM", label: "Observed depths m", kind: "numberList" },
  {
    id: "measuredTemperatureC",
    label: "Measured temperature c",
    kind: "numberList",
  },
  {
    id: "callerMatchedHydrateBoundaryC",
    label: "Caller matched hydrate boundary c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.observedDepthsM, input.measuredTemperatureC, "observedDepthsM");
  aligned(
    input.observedDepthsM,
    input.callerMatchedHydrateBoundaryC,
    "observedDepthsM",
  );
  strictlyIncreasing(input.observedDepthsM, "depth");
  const margin = input.callerMatchedHydrateBoundaryC.map(
    (v, i) => v - input.measuredTemperatureC[i],
  );
  let thick = 0;
  for (let i = 0; i < margin.length - 1; i++) {
    const a = margin[i],
      b = margin[i + 1],
      dz = input.observedDepthsM[i + 1] - input.observedDepthsM[i];
    if (a >= 0 && b >= 0) thick += dz;
    else if (a > 0 || b > 0)
      thick += (dz * Math.max(a, b)) / (Math.abs(a) + Math.abs(b));
  }
  return {
    stableObservedThicknessM: thick,
    observedBoundaryDepthsM: crossings(input.observedDepthsM, margin, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDepthsM: [0, 1, 2],
  measuredTemperatureC: [0, 0, 0],
  callerMatchedHydrateBoundaryC: [1, 1, -1],
} satisfies Input;
export const exampleOutput = {
  stableObservedThicknessM: 1.5,
  observedBoundaryDepthsM: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/geomechanics-hydrate-stability-zone-thickness",
  title: "Geology Geomechanics Hydrate Stability Zone Thickness Calculator",
  description:
    "Observed geothermal profile vs independent matching pressure/composition hydrate boundary; integrate stability-positive intervals with linear crossings, no inferred gas presence or outside-coverage thickness. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "stableObservedThicknessM",
      label: "Stable observed thickness m",
      kind: "number",
    },
    {
      id: "observedBoundaryDepthsM",
      label: "Observed boundary depths m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDepthsM: value.observedDepthsM as readonly number[],
      measuredTemperatureC: value.measuredTemperatureC as readonly number[],
      callerMatchedHydrateBoundaryC:
        value.callerMatchedHydrateBoundaryC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
