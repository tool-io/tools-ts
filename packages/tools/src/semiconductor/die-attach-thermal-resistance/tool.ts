import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedDieAttachHotSideKelvin: readonly number[];
  readonly observedDieAttachColdSideKelvin: readonly number[];
  readonly observedMatchedThroughHeatWatts: readonly number[];
}>;
export type Output = Readonly<{
  readonly measuredInterfaceThermalResistanceKWatts: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDieAttachHotSideKelvin",
    label: "Observed die attach hot side kelvin",
    kind: "numberList",
  },
  {
    id: "observedDieAttachColdSideKelvin",
    label: "Observed die attach cold side kelvin",
    kind: "numberList",
  },
  {
    id: "observedMatchedThroughHeatWatts",
    label: "Observed matched through heat watts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDieAttachHotSideKelvin.forEach((v) =>
    positive(v, "observedDieAttachHotSideKelvin"),
  );
  input.observedDieAttachColdSideKelvin.forEach((v) =>
    positive(v, "observedDieAttachColdSideKelvin"),
  );
  input.observedMatchedThroughHeatWatts.forEach((v) =>
    positive(v, "observedMatchedThroughHeatWatts"),
  );
  aligned(
    input.observedDieAttachHotSideKelvin,
    input.observedDieAttachColdSideKelvin,
    "observedDieAttachHotSideKelvin",
  );
  aligned(
    input.observedDieAttachHotSideKelvin,
    input.observedMatchedThroughHeatWatts,
    "observedDieAttachHotSideKelvin",
  );
  return {
    measuredInterfaceThermalResistanceKWatts:
      input.observedDieAttachHotSideKelvin.map(
        (v, i) =>
          (v - input.observedDieAttachColdSideKelvin[i]) /
          input.observedMatchedThroughHeatWatts[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDieAttachHotSideKelvin: [310, 320],
  observedDieAttachColdSideKelvin: [300, 300],
  observedMatchedThroughHeatWatts: [2, 5],
} satisfies Input;
export const exampleOutput = {
  measuredInterfaceThermalResistanceKWatts: [5, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/die-attach-thermal-resistance",
  title: "Semiconductor Die Attach Thermal Resistance Calculator",
  description:
    "Audit actual across-interface die-attach thermal resistance using independent through-interface heat flow, not whole-package junction-to-ambient dissipated power or layer conductivity.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredInterfaceThermalResistanceKWatts",
      label: "Measured interface thermal resistance k watts",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDieAttachHotSideKelvin:
        value.observedDieAttachHotSideKelvin as readonly number[],
      observedDieAttachColdSideKelvin:
        value.observedDieAttachColdSideKelvin as readonly number[],
      observedMatchedThroughHeatWatts:
        value.observedMatchedThroughHeatWatts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
