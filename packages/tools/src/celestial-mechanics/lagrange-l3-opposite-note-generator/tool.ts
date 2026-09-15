import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly regime: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "regime", label: "Regime", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.regime,
      {
        "small-mass-ratio-cr3bp":
          "L3 lies approximately opposite the secondary, near the primary-secondary separation from the primary; exact position depends on mass ratio.",
      },
      "regime",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { regime: "small-mass-ratio-cr3bp" },
  output: {
    result: {
      reference:
        "L3 lies approximately opposite the secondary, near the primary-secondary separation from the primary; exact position depends on mass ratio.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/lagrange-l3-opposite-note-generator",
  title: "Lagrange L3 Opposite Side Distance Approximately 1 AU Note",
  description:
    "Bounded L3 small-mass-ratio location note; 1 AU not universal and no equilibrium root solver.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
