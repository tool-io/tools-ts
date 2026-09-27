import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly base: number;
  readonly rate: number;
  readonly cap: number;
};
export type Output = {
  readonly uncapped: number;
  readonly charge: number;
  readonly capped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0 },
    cap: { type: "number", minimum: 0 },
  },
  required: ["base", "rate", "cap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncapped: { type: "number" },
    charge: { type: "number" },
    capped: { type: "boolean" },
  },
  required: ["uncapped", "charge", "capped"],
} as const;
/** Apply a supplied surcharge fraction and absolute monetary cap; no jurisdictional cap is selected. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { base, rate, cap } = input;
  const compute = (): Output => {
    H.domain(base >= 0 && rate >= 0 && cap >= 0);
    const uncapped = base * rate;
    return {
      uncapped,
      charge: Math.min(cap, uncapped),
      capped: uncapped > cap,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { base: 100, rate: 0.03, cap: 2 },
  output: { uncapped: 3, charge: 2, capped: true },
} satisfies ToolExample<Input, Output>;
export const merchantSurchargeCapReferenceBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/merchant-surcharge-cap-reference-base",
    title: "Merchant Surcharge Cap Reference Base Tool",
    description:
      "Apply a supplied surcharge fraction and absolute monetary cap; no jurisdictional cap is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "number", minimum: 0 },
        rate: { type: "number", minimum: 0 },
        cap: { type: "number", minimum: 0 },
      },
      required: ["base", "rate", "cap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncapped: { type: "number" },
        charge: { type: "number" },
        capped: { type: "boolean" },
      },
      required: ["uncapped", "charge", "capped"],
    },
    ports: {
      inputs: [
        {
          id: "base",
          label: "Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rate",
          label: "Rate",
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
        { id: "charge", label: "Charge", valueType: { type: "number" } },
        { id: "capped", label: "Capped", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = merchantSurchargeCapReferenceBaseTool.execute;
export default merchantSurchargeCapReferenceBaseTool;
