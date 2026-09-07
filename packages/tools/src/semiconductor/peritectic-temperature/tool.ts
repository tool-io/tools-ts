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
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPeritecticBoundaryTemperatureKelvin: readonly number[];
  readonly observedReactantProductFreeEnergyDifference: readonly number[];
  readonly callerPeritecticReactionBranchVerified: boolean;
}>;
export type Output = Readonly<{
  readonly observedPeritecticEquilibriumTemperatureCrossingsKelvin: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPeritecticBoundaryTemperatureKelvin",
    label: "Observed peritectic boundary temperature kelvin",
    kind: "numberList",
  },
  {
    id: "observedReactantProductFreeEnergyDifference",
    label: "Observed reactant product free energy difference",
    kind: "numberList",
  },
  {
    id: "callerPeritecticReactionBranchVerified",
    label: "Caller peritectic reaction branch verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPeritecticBoundaryTemperatureKelvin.forEach((v) =>
    positive(v, "observedPeritecticBoundaryTemperatureKelvin"),
  );
  if (!input.callerPeritecticReactionBranchVerified)
    simpleError(
      "reaction",
      "Independent liquid+solid→different-solid peritectic branch evidence required.",
    );
  return {
    observedPeritecticEquilibriumTemperatureCrossingsKelvin: crossings(
      input.observedPeritecticBoundaryTemperatureKelvin,
      input.observedReactantProductFreeEnergyDifference,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPeritecticBoundaryTemperatureKelvin: [100, 110, 120],
  observedReactantProductFreeEnergyDifference: [-2, 0, 2],
  callerPeritecticReactionBranchVerified: true,
} satisfies Input;
export const exampleOutput = {
  observedPeritecticEquilibriumTemperatureCrossingsKelvin: [110],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/peritectic-temperature",
  title: "Semiconductor Peritectic Temperature Calculator",
  description:
    "Extract independently verified peritectic reaction free-energy equilibrium crossings, not eutectic liquidus minimum, order parameter transition or processing recipe.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPeritecticEquilibriumTemperatureCrossingsKelvin",
      label: "Observed peritectic equilibrium temperature crossings kelvin",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPeritecticBoundaryTemperatureKelvin:
        value.observedPeritecticBoundaryTemperatureKelvin as readonly number[],
      observedReactantProductFreeEnergyDifference:
        value.observedReactantProductFreeEnergyDifference as readonly number[],
      callerPeritecticReactionBranchVerified:
        value.callerPeritecticReactionBranchVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
