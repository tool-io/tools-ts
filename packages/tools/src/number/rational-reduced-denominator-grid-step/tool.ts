import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly numerator: string;
  readonly denominator: string;
};
export type Output = {
  readonly denominator: string;
  readonly stepNumerator: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "string", maxLength: 8192 },
    denominator: { type: "string", maxLength: 8192 },
  },
  required: ["numerator", "denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "string", maxLength: 8192 },
    stepNumerator: { type: "string", maxLength: 8192 },
  },
  required: ["denominator", "stepNumerator"],
} as const;
/** Compute rational reduced denominator grid step from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { numerator, denominator } = input;
  const compute = (): Output => {
    let a = decimal(numerator),
      b = decimal(denominator);
    domain(b > 0n);
    a = a < 0n ? -a : a;
    const original = b;
    while (b) {
      [a, b] = [b, a % b];
    }
    return { denominator: (original / a).toString(), stepNumerator: "1" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { numerator: "6", denominator: "15" },
  output: { denominator: "5", stepNumerator: "1" },
} satisfies ToolExample<Input, Output>;
export const rationalReducedDenominatorGridStepTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "number/rational-reduced-denominator-grid-step",
  title: "Rational Reduced Denominator Grid Step Tool",
  description:
    "Compute rational reduced denominator grid step from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "numerator",
        label: "Numerator",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "denominator",
        label: "Denominator",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "denominator",
        label: "Denominator",
        valueType: { type: "string" },
      },
      {
        id: "stepNumerator",
        label: "Step Numerator",
        valueType: { type: "string" },
      },
    ],
  },
});
export const run = rationalReducedDenominatorGridStepTool.execute;
export default rationalReducedDenominatorGridStepTool;
