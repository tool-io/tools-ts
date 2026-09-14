import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly digestBits: number;
  readonly targetProbability: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "digestBits", label: "Digest bits", kind: "number" },
  { id: "targetProbability", label: "Target probability", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.digestBits, "bits", 1, 1024);
  if (i.targetProbability <= 0 || i.targetProbability >= 1)
    simpleError("probability", "Strict 0<p<1.");
  return {
    approximateAttempts:
      Math.sqrt(2 * -Math.log1p(-i.targetProbability)) *
      2 ** (i.digestBits / 2),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { digestBits: 16, targetProbability: 0.3934693402873666 },
  output: { result: { approximateAttempts: 256 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/hash-collision-birthday-attempts-estimate",
  title: "Hash Collision Birthday Attempts Estimate",
  description:
    "Birthday-Poisson inverse estimate for independent uniform digests, not an exact integer collision probability.",
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
