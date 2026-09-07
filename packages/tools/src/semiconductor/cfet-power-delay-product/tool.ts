import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedCfetCyclePowersWatts: readonly number[];
  readonly observedMatchedDelaySeconds: readonly number[];
  readonly observedIndependentSwitchEnergyJ: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedPowerDelayProductsJ: readonly number[];
  readonly signedPdpMinusMeasuredSwitchEnergyJ: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCfetCyclePowersWatts",
    label: "Observed cfet cycle powers watts",
    kind: "numberList",
  },
  {
    id: "observedMatchedDelaySeconds",
    label: "Observed matched delay seconds",
    kind: "numberList",
  },
  {
    id: "observedIndependentSwitchEnergyJ",
    label: "Observed independent switch energy j",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCfetCyclePowersWatts.forEach((v) =>
    nonnegative(v, "observedCfetCyclePowersWatts"),
  );
  input.observedMatchedDelaySeconds.forEach((v) =>
    nonnegative(v, "observedMatchedDelaySeconds"),
  );
  input.observedIndependentSwitchEnergyJ.forEach((v) =>
    nonnegative(v, "observedIndependentSwitchEnergyJ"),
  );
  aligned(
    input.observedCfetCyclePowersWatts,
    input.observedMatchedDelaySeconds,
    "observedCfetCyclePowersWatts",
  );
  aligned(
    input.observedCfetCyclePowersWatts,
    input.observedIndependentSwitchEnergyJ,
    "observedCfetCyclePowersWatts",
  );
  const pdp = input.observedCfetCyclePowersWatts.map(
    (v, i) => v * input.observedMatchedDelaySeconds[i],
  );
  return {
    observedPowerDelayProductsJ: pdp,
    signedPdpMinusMeasuredSwitchEnergyJ: pdp.map(
      (v, i) => v - input.observedIndependentSwitchEnergyJ[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCfetCyclePowersWatts: [2, 3],
  observedMatchedDelaySeconds: [0.5, 1],
  observedIndependentSwitchEnergyJ: [0.8, 2],
} satisfies Input;
export const exampleOutput = {
  observedPowerDelayProductsJ: [1, 3],
  signedPdpMinusMeasuredSwitchEnergyJ: [0.2, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/cfet-power-delay-product",
  title: "Semiconductor Cfet Power Delay Product Calculator",
  description:
    "Compare actual CFET power-delay products with independently measured switching energies, definitions not presumed identical and signed discrepancy retained; not generic energy=power×duration alone.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPowerDelayProductsJ",
      label: "Observed power delay products j",
      kind: "numberList",
    },
    {
      id: "signedPdpMinusMeasuredSwitchEnergyJ",
      label: "Signed pdp minus measured switch energy j",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCfetCyclePowersWatts:
        value.observedCfetCyclePowersWatts as readonly number[],
      observedMatchedDelaySeconds:
        value.observedMatchedDelaySeconds as readonly number[],
      observedIndependentSwitchEnergyJ:
        value.observedIndependentSwitchEnergyJ as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
