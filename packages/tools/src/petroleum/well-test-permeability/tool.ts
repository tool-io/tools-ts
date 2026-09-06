import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  linearFit,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedRadialTestElapsedSeconds: readonly number[];
  readonly observedNaturalLogDrawdownPa: readonly number[];
  readonly observedStockFlowM3Second: number;
  readonly observedFluidViscosityPaSeconds: number;
  readonly callerMatchedFormationVolumeFactor: number;
  readonly observedNetPayThicknessM: number;
  readonly callerInfiniteActingRadialBranchVerified: boolean;
}>;
export type Output = Readonly<{
  readonly radialTestInferredPermeabilityM2: number;
  readonly naturalLogPressureSlopePa: number;
}>;
const inputFields = [
  {
    id: "observedRadialTestElapsedSeconds",
    label: "Observed radial test elapsed seconds",
    kind: "numberList",
  },
  {
    id: "observedNaturalLogDrawdownPa",
    label: "Observed natural log drawdown pa",
    kind: "numberList",
  },
  {
    id: "observedStockFlowM3Second",
    label: "Observed stock flow m3 second",
    kind: "number",
  },
  {
    id: "observedFluidViscosityPaSeconds",
    label: "Observed fluid viscosity pa seconds",
    kind: "number",
  },
  {
    id: "callerMatchedFormationVolumeFactor",
    label: "Caller matched formation volume factor",
    kind: "number",
  },
  {
    id: "observedNetPayThicknessM",
    label: "Observed net pay thickness m",
    kind: "number",
  },
  {
    id: "callerInfiniteActingRadialBranchVerified",
    label: "Caller infinite acting radial branch verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRadialTestElapsedSeconds.forEach((v) =>
    positive(v, "observedRadialTestElapsedSeconds"),
  );
  positive(
    input.observedFluidViscosityPaSeconds,
    "observedFluidViscosityPaSeconds",
  );
  positive(
    input.callerMatchedFormationVolumeFactor,
    "callerMatchedFormationVolumeFactor",
  );
  positive(input.observedNetPayThicknessM, "observedNetPayThicknessM");
  nonnegative(input.observedStockFlowM3Second, "observedStockFlowM3Second");
  input.observedNaturalLogDrawdownPa.forEach((v) =>
    nonnegative(v, "observedNaturalLogDrawdownPa"),
  );
  if (!input.callerInfiniteActingRadialBranchVerified)
    simpleError(
      "branch",
      "Independent constant-rate infinite-acting radial single-phase regime evidence required.",
    );
  const f = linearFit(
    input.observedRadialTestElapsedSeconds.map(Math.log),
    input.observedNaturalLogDrawdownPa,
  );
  positive(f.slope, "radial natural-log pressure slope");
  return {
    radialTestInferredPermeabilityM2:
      (input.observedStockFlowM3Second *
        input.observedFluidViscosityPaSeconds *
        input.callerMatchedFormationVolumeFactor) /
      (4 * Math.PI * input.observedNetPayThicknessM * f.slope),
    naturalLogPressureSlopePa: f.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRadialTestElapsedSeconds: [1, 2.718281828459045, 7.3890560989306495],
  observedNaturalLogDrawdownPa: [1, 2, 3],
  observedStockFlowM3Second: 1,
  observedFluidViscosityPaSeconds: 1,
  callerMatchedFormationVolumeFactor: 1,
  observedNetPayThicknessM: 1,
  callerInfiniteActingRadialBranchVerified: true,
} satisfies Input;
export const exampleOutput = {
  radialTestInferredPermeabilityM2: 0.07957747154594767,
  naturalLogPressureSlopePa: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/well-test-permeability",
  title: "Petroleum Well Test Permeability Calculator",
  description:
    "Infer radial-test permeability from actual pressure versus NATURAL LOG elapsed time slope with SI qμB/(4πhm), not log10 oilfield unit constant or steady Darcy core permeability; caller independently selects regime. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "radialTestInferredPermeabilityM2",
      label: "Radial test inferred permeability m2",
      kind: "number",
    },
    {
      id: "naturalLogPressureSlopePa",
      label: "Natural log pressure slope pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRadialTestElapsedSeconds:
        value.observedRadialTestElapsedSeconds as readonly number[],
      observedNaturalLogDrawdownPa:
        value.observedNaturalLogDrawdownPa as readonly number[],
      observedStockFlowM3Second: value.observedStockFlowM3Second as number,
      observedFluidViscosityPaSeconds:
        value.observedFluidViscosityPaSeconds as number,
      callerMatchedFormationVolumeFactor:
        value.callerMatchedFormationVolumeFactor as number,
      observedNetPayThicknessM: value.observedNetPayThicknessM as number,
      callerInfiniteActingRadialBranchVerified:
        value.callerInfiniteActingRadialBranchVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
