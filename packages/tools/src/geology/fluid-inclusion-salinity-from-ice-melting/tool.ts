import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly finalIceMeltingTemperaturesC: readonly number[];
}>;
export type Output = Readonly<{
  readonly naclEquivalentWeightPercents: readonly number[];
}>;
const inputFields = [
  {
    id: "finalIceMeltingTemperaturesC",
    label: "Final ice melting temperatures c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.finalIceMeltingTemperaturesC.forEach((t) => {
    if (t > 0 || t < -21.2)
      simpleError("temperature", "NaCl-water ice liquidus−21.2..0C only.");
  });
  return {
    naclEquivalentWeightPercents: input.finalIceMeltingTemperaturesC.map(
      (t) => {
        const d = -t;
        return 1.78 * d - 0.0442 * d * d + 0.000557 * d * d * d;
      },
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  finalIceMeltingTemperaturesC: [0, -10],
} satisfies Input;
export const exampleOutput = {
  naclEquivalentWeightPercents: [0, 13.937],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fluid-inclusion-salinity-from-ice-melting",
  title: "Geology Fluid Inclusion Salinity From Ice Melting Calculator",
  description:
    "Bodnar 1993 NaCl-water ice liquidus 1.78d−.0442d²+.000557d³ wt%NaCl equivalent, not mixed salt composition; final ice melting not homogenization. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "naclEquivalentWeightPercents",
      label: "Nacl equivalent weight percents",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      finalIceMeltingTemperaturesC:
        value.finalIceMeltingTemperaturesC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
