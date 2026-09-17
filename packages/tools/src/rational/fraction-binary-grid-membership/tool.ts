import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  numerator: string;
  denominator: string;
  fractionalBits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "numerator", kind: "string", label: "numerator" },
  { id: "denominator", kind: "string", label: "denominator" },
  { id: "fractionalBits", kind: "integer", label: "fractionalBits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [n, d] = H.fracInput(i.numerator, i.denominator);
  H.int(i.fractionalBits, 0, 128);
  return H.finish({
    member: (n * (1n << BigInt(i.fractionalBits))) % d === 0n,
  });
};
export const example = {
  input: { numerator: "3", denominator: "8", fractionalBits: 2 },
  output: { result: { member: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rational/fraction-binary-grid-membership",
  title: "Fraction Binary Grid Membership",
  description:
    "Check exact rational membership on an explicitly chosen binary fixed-point grid, not merely denominator power-of-two termination.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
