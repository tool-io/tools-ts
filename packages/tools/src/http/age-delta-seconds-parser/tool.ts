import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, decimalUnsigned } from "../batch53-shared.js";

export type Input = Readonly<{ value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const canonical = decimalUnsigned(i.value),
    n = BigInt(canonical),
    limit = 2147483648n;
  return {
    canonicalDecimal: canonical,
    conservativeAgeSeconds: Number(n > limit ? limit : n),
    saturated: n > limit,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { value: "00042" },
  output: {
    result: {
      canonicalDecimal: "42",
      conservativeAgeSeconds: 42,
      saturated: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/age-delta-seconds-parser",
  title: "HTTP Age Delta Seconds Parser",
  description:
    "Parse HTTP Age delta-seconds as unsigned decimal; retain exact spelling-normalized value and conservatively saturate numeric age at 2^31 seconds.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
