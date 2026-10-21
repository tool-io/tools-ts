import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyResolvedRecombinationPeakFrequencyHz: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIndependentlyResolvedRecombinationPeakFrequencyHz",
    label: "Actual independently resolved recombination peak frequency hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.actualIndependentlyResolvedRecombinationPeakFrequencyHz,
    "frequency",
  );
  return {
    conditionalSinglePoleElectronLifetimeSeconds:
      1 /
      (2 *
        Math.PI *
        input.actualIndependentlyResolvedRecombinationPeakFrequencyHz),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentlyResolvedRecombinationPeakFrequencyHz: 1 },
  output: {
    result: {
      conditionalSinglePoleElectronLifetimeSeconds: 0.15915494309189535,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/dye-sensitized-cell-electron-lifetime",
  title: "Semiconductor Dye Sensitized Cell Electron Lifetime Calculator",
  description:
    "Dye-sensitized-cell single-pole lifetime1/(2\u03c0f) from independently resolved recombination characteristic peak, not arbitrary impedance peak or multi-process fit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditionalSinglePoleElectronLifetimeSeconds: { type: "number" },
        },
        required: ["conditionalSinglePoleElectronLifetimeSeconds"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
