import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sigmaDigital } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualCanonicalDecimal: string;
  readonly actualIndependentlySpecifiedDigitPower: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCanonicalDecimal",
    label: "Actual canonical decimal",
    kind: "string",
  },
  {
    id: "actualIndependentlySpecifiedDigitPower",
    label: "Actual independently specified digit power",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const a = sigmaDigital(
    input.actualCanonicalDecimal,
    input.actualIndependentlySpecifiedDigitPower,
    "power",
  );
  return {
    exactDigitPowerSum: a,
    isSpecifiedPowerInvariant: a === input.actualCanonicalDecimal,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCanonicalDecimal: "153",
    actualIndependentlySpecifiedDigitPower: 3,
  },
  output: {
    result: { exactDigitPowerSum: "153", isSpecifiedPowerInvariant: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/perfect-digital-invariant",
  title: "Perfect Digital Invariant Checker",
  description:
    "Perfect digital invariant with independent fixed power(not automatically decimaldigitlengthasArmstrong), exactBigIntdigitpowers\u2264128. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
