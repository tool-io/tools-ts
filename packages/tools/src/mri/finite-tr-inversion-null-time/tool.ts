import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly t1Ms: number;
  readonly trMs: number;
}>;
export type Output = Readonly<{
  readonly nullTimeMs: number;
}>;
const inputFields = [
  { id: "t1Ms", label: "T1 ms", kind: "number", unit: "ms" },
  { id: "trMs", label: "Tr ms", kind: "number", unit: "ms" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.t1Ms, "t1Ms");
  positive(input.trMs, "trMs");
  return {
    nullTimeMs:
      input.t1Ms * Math.log(2 / (1 + Math.exp(-input.trMs / input.t1Ms))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { t1Ms: 1000, trMs: 1000 } satisfies Input;
export const exampleOutput = { nullTimeMs: 379.8854930417225 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/finite-tr-inversion-null-time",
  title: "Inversion Time TI",
  description:
    "Solve an ideal repeated inversion-recovery null TI=T1·ln[2/(1+exp(−TR/T1))]; assumes ideal inversion and saturation/readout convention, not a patient-specific protocol.",
  inputs: inputFields,
  outputs: [
    { id: "nullTimeMs", label: "Null time ms", kind: "number", unit: "ms" },
  ],
  calculate: (value) =>
    calculate({
      t1Ms: value.t1Ms as number,
      trMs: value.trMs as number,
    }),
});
export const run = tool.execute;
export default tool;
