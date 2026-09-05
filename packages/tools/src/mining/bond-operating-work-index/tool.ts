import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedGrossMillKwhTonnes: readonly number[];
  readonly observedIndependentIdleKwhTonnes: readonly number[];
  readonly observedFeedP80Microns: readonly number[];
  readonly observedProductP80Microns: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedIdleCorrectedOperatingBondIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGrossMillKwhTonnes",
    label: "Observed gross mill kwh tonnes",
    kind: "numberList",
  },
  {
    id: "observedIndependentIdleKwhTonnes",
    label: "Observed independent idle kwh tonnes",
    kind: "numberList",
  },
  {
    id: "observedFeedP80Microns",
    label: "Observed feed p80 microns",
    kind: "numberList",
  },
  {
    id: "observedProductP80Microns",
    label: "Observed product p80 microns",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedFeedP80Microns.forEach((v) =>
    positive(v, "observedFeedP80Microns"),
  );
  input.observedProductP80Microns.forEach((v) =>
    positive(v, "observedProductP80Microns"),
  );
  input.observedGrossMillKwhTonnes.forEach((v) =>
    nonnegative(v, "observedGrossMillKwhTonnes"),
  );
  input.observedIndependentIdleKwhTonnes.forEach((v) =>
    nonnegative(v, "observedIndependentIdleKwhTonnes"),
  );
  aligned(
    input.observedGrossMillKwhTonnes,
    input.observedIndependentIdleKwhTonnes,
    "observedGrossMillKwhTonnes",
  );
  aligned(
    input.observedGrossMillKwhTonnes,
    input.observedFeedP80Microns,
    "observedGrossMillKwhTonnes",
  );
  aligned(
    input.observedGrossMillKwhTonnes,
    input.observedProductP80Microns,
    "observedGrossMillKwhTonnes",
  );
  return {
    observedIdleCorrectedOperatingBondIndices:
      input.observedGrossMillKwhTonnes.map((v, i) => {
        const net = v - input.observedIndependentIdleKwhTonnes[i];
        nonnegative(net, "net mill energy");
        const size =
          10 / Math.sqrt(input.observedProductP80Microns[i]) -
          10 / Math.sqrt(input.observedFeedP80Microns[i]);
        positive(size, "Bond reduction branch");
        return net / size;
      }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGrossMillKwhTonnes: [20, 30],
  observedIndependentIdleKwhTonnes: [5, 10],
  observedFeedP80Microns: [1000, 1000],
  observedProductP80Microns: [100, 100],
} satisfies Input;
export const exampleOutput = {
  observedIdleCorrectedOperatingBondIndices: [
    21.93712943361397, 29.24950591148529,
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/bond-operating-work-index",
  title: "Bond Operating Work Index Calculator",
  description:
    "Audit gross and independently measured idle mill energy before operating Bond work-index inversion, not existing net-energy direct inverse. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedIdleCorrectedOperatingBondIndices",
      label: "Observed idle corrected operating bond indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGrossMillKwhTonnes:
        value.observedGrossMillKwhTonnes as readonly number[],
      observedIndependentIdleKwhTonnes:
        value.observedIndependentIdleKwhTonnes as readonly number[],
      observedFeedP80Microns: value.observedFeedP80Microns as readonly number[],
      observedProductP80Microns:
        value.observedProductP80Microns as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
