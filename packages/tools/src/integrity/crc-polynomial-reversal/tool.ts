import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ polynomial: string; degree: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "polynomial", kind: "string", label: "polynomial" },
  { id: "degree", kind: "integer", label: "degree" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.degree, 1, 128);
  const p = H.bigint(i.polynomial);
  H.check(
    p >= 1n << BigInt(i.degree) &&
      p < 1n << BigInt(i.degree + 1) &&
      p % 2n === 1n,
  );
  let reversed = 0n;
  for (let j = 0; j <= i.degree; j++)
    reversed = (reversed << 1n) | ((p >> BigInt(j)) & 1n);
  return H.finish({ reciprocalPolynomial: String(reversed) });
};
export const example = {
  input: { polynomial: "19", degree: 4 },
  output: { result: { reciprocalPolynomial: "25" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/crc-polynomial-reversal",
  title: "CRC Polynomial Reversal Tool",
  description:
    "Reverse all coefficients of a full monic CRC polynomial with nonzero constant coefficient to obtain its reciprocal; includes the leading coefficient.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reciprocalPolynomial: { type: "string" } },
        required: ["reciprocalPolynomial"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
