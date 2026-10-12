import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly massSolar: number;
  readonly callerPowerExponent: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "massSolar", label: "Mass solar", kind: "number" },
  { id: "callerPowerExponent", label: "Caller power exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.massSolar, "mass");
  positive(i.callerPowerExponent, "exponent");
  return { conditionalLuminositySolar: i.massSolar ** i.callerPowerExponent };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { massSolar: 2, callerPowerExponent: 4 },
  output: { result: { conditionalLuminositySolar: 16 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/luminosity-mass-powerlaw-approximation",
  title: "Stellar Luminosity Mass Power-Law Approximation Calculator",
  description:
    "Caller regime-specific stellar luminosity/mass power law L/Lsun=(M/Msun)^alpha; alpha not universally four, not evolutionary track.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalLuminositySolar: { type: "number" } },
        required: ["conditionalLuminositySolar"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
