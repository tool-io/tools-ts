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
  fraction,
  extrema,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedLiquidusCompositionFractions: readonly number[];
  readonly observedLiquidusTemperatureKelvin: readonly number[];
  readonly callerEutecticBranchVerified: boolean;
}>;
export type Output = Readonly<{
  readonly observedEutecticCompositionCandidates: readonly number[];
  readonly observedMinimumLiquidusKelvin: number;
}>;
const inputFields = [
  {
    id: "observedLiquidusCompositionFractions",
    label: "Observed liquidus composition fractions",
    kind: "numberList",
  },
  {
    id: "observedLiquidusTemperatureKelvin",
    label: "Observed liquidus temperature kelvin",
    kind: "numberList",
  },
  {
    id: "callerEutecticBranchVerified",
    label: "Caller eutectic branch verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLiquidusTemperatureKelvin.forEach((v) =>
    positive(v, "observedLiquidusTemperatureKelvin"),
  );
  input.observedLiquidusCompositionFractions.forEach((v) =>
    fraction(v, "observedLiquidusCompositionFractions"),
  );
  if (!input.callerEutecticBranchVerified)
    simpleError(
      "phase",
      "Independent eutectic phase-branch evidence required.",
    );
  const result = extrema(
    input.observedLiquidusCompositionFractions,
    input.observedLiquidusTemperatureKelvin,
    false,
  );
  return {
    observedEutecticCompositionCandidates: result.coordinates,
    observedMinimumLiquidusKelvin: result.value,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLiquidusCompositionFractions: [0, 0.5, 1],
  observedLiquidusTemperatureKelvin: [120, 100, 130],
  callerEutecticBranchVerified: true,
} satisfies Input;
export const exampleOutput = {
  observedEutecticCompositionCandidates: [0.5],
  observedMinimumLiquidusKelvin: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/eutectic-composition",
  title: "Semiconductor Eutectic Composition Calculator",
  description:
    "Locate actual minimum/tied liquidus composition samples on independently verified eutectic branch, no inference from an arbitrary valley or unsampled minimum.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedEutecticCompositionCandidates",
      label: "Observed eutectic composition candidates",
      kind: "numberList",
    },
    {
      id: "observedMinimumLiquidusKelvin",
      label: "Observed minimum liquidus kelvin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLiquidusCompositionFractions:
        value.observedLiquidusCompositionFractions as readonly number[],
      observedLiquidusTemperatureKelvin:
        value.observedLiquidusTemperatureKelvin as readonly number[],
      callerEutecticBranchVerified:
        value.callerEutecticBranchVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
