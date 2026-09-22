import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly futureAmount: number;
  readonly presentEquivalent: number;
  readonly rate: number;
};
export type Output = { readonly delay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    futureAmount: { type: "number" },
    presentEquivalent: { type: "number", exclusiveMinimum: 0 },
    rate: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["futureAmount", "presentEquivalent", "rate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delay: { type: "number" } },
  required: ["delay"],
} as const;
/** Solve V=A/(1+k*t) for nonnegative t with explicit hyperbolic rate k; not an empirical preference estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { futureAmount, presentEquivalent, rate } = request;
  const compute = (): Output => {
    H.positive(presentEquivalent);
    H.domain(futureAmount >= presentEquivalent);
    H.positive(rate);
    return { delay: (futureAmount / presentEquivalent - 1) / rate };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { futureAmount: 120, presentEquivalent: 100, rate: 0.01 },
  output: { delay: 19.999999999999996 },
} satisfies ToolExample<Input, Output>;
export const hyperbolicDiscountEquivalentDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/hyperbolic-discount-equivalent-delay",
    title: "Hyperbolic Discount Equivalent Delay Tool",
    description:
      "Solve V=A/(1+k*t) for nonnegative t with explicit hyperbolic rate k; not an empirical preference estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        futureAmount: { type: "number" },
        presentEquivalent: { type: "number", exclusiveMinimum: 0 },
        rate: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["futureAmount", "presentEquivalent", "rate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delay: { type: "number" } },
      required: ["delay"],
    },
    ports: {
      inputs: [
        {
          id: "futureAmount",
          label: "Future Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "presentEquivalent",
          label: "Present Equivalent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "delay", label: "Delay", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = hyperbolicDiscountEquivalentDelayTool.execute;
export default hyperbolicDiscountEquivalentDelayTool;
