import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualCanonicalDecimalHoistFlyRatio: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCanonicalDecimalHoistFlyRatio",
    label: "Actual canonical decimal hoist fly ratio",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (
    !/^(0|[1-9][0-9]{0,11})(?:\.[0-9]{1,12})?$/.test(
      input.actualCanonicalDecimalHoistFlyRatio,
    )
  )
    simpleError(
      "ratio",
      "Positivecanonicaldecimal≤12integer/12fractiondigits.",
    );
  const p = input.actualCanonicalDecimalHoistFlyRatio.split("."),
    b = 10n ** BigInt(p[1]?.length ?? 0),
    a = BigInt(p[0]) * b + BigInt(p[1] ?? "0");
  if (a === 0n) simpleError("ratio", "Positivehoist/fly.");
  let x = a,
    y = b;
  while (y) [x, y] = [y, x % y];
  return {
    reducedHoist: (a / x).toString(),
    reducedFly: (b / x).toString(),
    formattedRatio: `${a / x}:${b / x}`,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualCanonicalDecimalHoistFlyRatio: "0.75" },
  output: {
    result: { reducedHoist: "3", reducedFly: "4", formattedRatio: "3:4" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/decimal-to-hw-fraction",
  title: "Decimal Ratio to H-W Fraction Formatter",
  description:
    "EXACTdecimalTEXT to rationalhoist/fly formattingusingBigInt,no continued-fractionapproximationor arbitrarybinary64fraction. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
