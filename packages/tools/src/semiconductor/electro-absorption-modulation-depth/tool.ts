import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredUnmodulatedOpticalPowerWatts: number;
  readonly matchedModulatedOpticalPowerWatts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredUnmodulatedOpticalPowerWatts",
    label: "Independently measured unmodulated optical power watts",
    kind: "number",
  },
  {
    id: "matchedModulatedOpticalPowerWatts",
    label: "Matched modulated optical power watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.independentlyMeasuredUnmodulatedOpticalPowerWatts,
    "reference-power",
  );
  nonnegative(input.matchedModulatedOpticalPowerWatts, "modulated-power");
  return {
    signedObservedModulationDepthFraction:
      1 -
      input.matchedModulatedOpticalPowerWatts /
        input.independentlyMeasuredUnmodulatedOpticalPowerWatts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredUnmodulatedOpticalPowerWatts: 10,
    matchedModulatedOpticalPowerWatts: 4,
  },
  output: { result: { signedObservedModulationDepthFraction: 0.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/electro-absorption-modulation-depth",
  title: "Semiconductor Electro Absorption Modulation Depth Calculator",
  description:
    "Actual electroabsorption intensity modulation depth (Poff\u2212Pon)/Poff, not field amplitude modulation, extinction-ratio dBor universal device response.",
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
