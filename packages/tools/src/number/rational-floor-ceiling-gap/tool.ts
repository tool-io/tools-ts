import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: string;
  readonly denominator: string;
};
export type Output = {
  readonly floor: string;
  readonly ceiling: string;
  readonly gap: number;
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
    floor: { type: "string", maxLength: 8192 },
    ceiling: { type: "string", maxLength: 8192 },
    gap: { type: "integer" },
  },
  required: ["floor", "ceiling", "gap"],
} as const;
/** Calculate rational floor ceiling gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerator, denominator } = request;
  const compute = (): Output => {
    const n = H.decimal(numerator),
      d = H.decimal(denominator);
    H.domain(d !== 0n);
    let q = n / d;
    const r = n % d;
    if (r !== 0n && n < 0n !== d < 0n) q--;
    const ceiling = r === 0n ? q : q + 1n;
    return {
      floor: String(q),
      ceiling: String(ceiling),
      gap: r === 0n ? 0 : 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerator: "-7", denominator: "3" },
  output: { floor: "-3", ceiling: "-2", gap: 1 },
} satisfies ToolExample<Input, Output>;
export const rationalFloorCeilingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/rational-floor-ceiling-gap",
    title: "Rational Floor Ceiling Gap Tool",
    description:
      "Calculate rational floor ceiling gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numerator: { type: "string", maxLength: 8192 },
        denominator: { type: "string", maxLength: 8192 },
      },
      required: ["numerator", "denominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        floor: { type: "string", maxLength: 8192 },
        ceiling: { type: "string", maxLength: 8192 },
        gap: { type: "integer" },
      },
      required: ["floor", "ceiling", "gap"],
    },
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
        { id: "floor", label: "Floor", valueType: { type: "string" } },
        { id: "ceiling", label: "Ceiling", valueType: { type: "string" } },
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = rationalFloorCeilingGapTool.execute;
export default rationalFloorCeilingGapTool;
