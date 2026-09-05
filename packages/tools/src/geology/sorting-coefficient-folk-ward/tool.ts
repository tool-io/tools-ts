import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sequence } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly phi5: number;
  readonly phi16: number;
  readonly phi84: number;
  readonly phi95: number;
}>;
export type Output = Readonly<{ readonly graphicSorting: number }>;
const inputFields = [
  { id: "phi5", label: "Phi5", kind: "number" },
  { id: "phi16", label: "Phi16", kind: "number" },
  { id: "phi84", label: "Phi84", kind: "number" },
  { id: "phi95", label: "Phi95", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  sequence([input.phi5, input.phi16, input.phi84, input.phi95], "quantiles");
  return {
    graphicSorting:
      (input.phi84 - input.phi16) / 4 + (input.phi95 - input.phi5) / 6.6,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  phi5: -2,
  phi16: -1,
  phi84: 1,
  phi95: 2,
} satisfies Input;
export const exampleOutput = {
  graphicSorting: 1.106060606060606,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/sorting-coefficient-folk-ward",
  title: "Geology Sorting Coefficient Folk Ward Calculator",
  description:
    "Folk–Ward inclusive graphic PHI sorting, not Trask diameter quartiles. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [{ id: "graphicSorting", label: "Graphic sorting", kind: "number" }],
  calculate: (value) =>
    calculate({
      phi5: value.phi5 as number,
      phi16: value.phi16 as number,
      phi84: value.phi84 as number,
      phi95: value.phi95 as number,
    }),
});
export const run = tool.execute;
export default tool;
