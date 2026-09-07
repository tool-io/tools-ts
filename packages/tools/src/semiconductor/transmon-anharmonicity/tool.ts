import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTransition01Hz: number;
  readonly observedTransition12Hz: number;
}>;
export type Output = Readonly<{
  readonly signedTransmonAnharmonicityHz: number;
  readonly signedRelativeAnharmonicity: number;
}>;
const inputFields = [
  {
    id: "observedTransition01Hz",
    label: "Observed transition01 hz",
    kind: "number",
  },
  {
    id: "observedTransition12Hz",
    label: "Observed transition12 hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedTransition01Hz, "observedTransition01Hz");
  positive(input.observedTransition12Hz, "observedTransition12Hz");
  const difference =
    input.observedTransition12Hz - input.observedTransition01Hz;
  return {
    signedTransmonAnharmonicityHz: difference,
    signedRelativeAnharmonicity: difference / input.observedTransition01Hz,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTransition01Hz: 5,
  observedTransition12Hz: 4.8,
} satisfies Input;
export const exampleOutput = {
  signedTransmonAnharmonicityHz: -0.2,
  signedRelativeAnharmonicity: -0.04,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/transmon-anharmonicity",
  title: "Semiconductor Transmon Anharmonicity Calculator",
  description:
    "Audit actual spectroscopic f12−f01 anharmonicity retaining sign, not forward EC/h approximation or transmon frequency formula.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedTransmonAnharmonicityHz",
      label: "Signed transmon anharmonicity hz",
      kind: "number",
    },
    {
      id: "signedRelativeAnharmonicity",
      label: "Signed relative anharmonicity",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTransition01Hz: value.observedTransition01Hz as number,
      observedTransition12Hz: value.observedTransition12Hz as number,
    }),
});
export const run = tool.execute;
export default tool;
