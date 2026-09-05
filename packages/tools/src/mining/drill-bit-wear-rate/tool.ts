import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  secants,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDrilledLengthsM: readonly number[];
  readonly observedBitDiametersMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSignedBitWearMmPerM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDrilledLengthsM",
    label: "Observed drilled lengths m",
    kind: "numberList",
  },
  {
    id: "observedBitDiametersMm",
    label: "Observed bit diameters mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const slopes = secants(
    input.observedDrilledLengthsM,
    input.observedBitDiametersMm,
  );
  input.observedDrilledLengthsM.forEach((v) => nonnegative(v, "length"));
  input.observedBitDiametersMm.forEach((v) => positive(v, "diameter"));
  return { observedSignedBitWearMmPerM: slopes.map((v) => -v) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDrilledLengthsM: [0, 10, 30],
  observedBitDiametersMm: [100, 99, 97],
} satisfies Input;
export const exampleOutput = {
  observedSignedBitWearMmPerM: [0.1, 0.1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/drill-bit-wear-rate",
  title: "Drill Bit Wear Rate Calculator",
  description:
    "Extract actual successive bit dimensional wear rates, signed apparent growth retained, not complete-bit lifetime or extrapolated linear retirement scenario. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSignedBitWearMmPerM",
      label: "Observed signed bit wear mm per m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDrilledLengthsM:
        value.observedDrilledLengthsM as readonly number[],
      observedBitDiametersMm: value.observedBitDiametersMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
