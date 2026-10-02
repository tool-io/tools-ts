import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly total: number;
  readonly fraction: number;
  readonly cap: number;
};
export type Output = {
  readonly uncapped: number;
  readonly capped: number;
  readonly boundaryExcess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "number", minimum: 0 },
    fraction: { type: "number", minimum: 0, maximum: 1 },
    cap: { type: "number", minimum: 0 },
  },
  required: ["total", "fraction", "cap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncapped: { type: "number" },
    capped: { type: "number" },
    boundaryExcess: { type: "number" },
  },
  required: ["uncapped", "capped", "boundaryExcess"],
} as const;
/** Calculate proportional cap boundary mass from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { total, fraction, cap } = request;
  const compute = (): Output => {
    H.domain(total >= 0 && cap >= 0);
    H.probability(fraction);
    return {
      uncapped: total * fraction,
      capped: Math.min(total * fraction, cap),
      boundaryExcess: Math.max(0, total * fraction - cap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { total: 100, fraction: 0.6, cap: 50 },
  output: { uncapped: 60, capped: 50, boundaryExcess: 10 },
} satisfies ToolExample<Input, Output>;
export const proportionalCapBoundaryMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/proportional-cap-boundary-mass",
    title: "Proportional Cap Boundary Mass Tool",
    description:
      "Calculate proportional cap boundary mass from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "number", minimum: 0 },
        fraction: { type: "number", minimum: 0, maximum: 1 },
        cap: { type: "number", minimum: 0 },
      },
      required: ["total", "fraction", "cap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncapped: { type: "number" },
        capped: { type: "number" },
        boundaryExcess: { type: "number" },
      },
      required: ["uncapped", "capped", "boundaryExcess"],
    },
    ports: {
      inputs: [
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fraction",
          label: "Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cap",
          label: "Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "uncapped", label: "Uncapped", valueType: { type: "number" } },
        { id: "capped", label: "Capped", valueType: { type: "number" } },
        {
          id: "boundaryExcess",
          label: "Boundary Excess",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = proportionalCapBoundaryMassTool.execute;
export default proportionalCapBoundaryMassTool;
