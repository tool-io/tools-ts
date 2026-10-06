import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousCount: number;
  readonly currentCount: number;
  readonly modulus: number;
};
export type Output = {
  readonly forwardIncrement: number;
  readonly wrapped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousCount: { type: "integer", minimum: 0 },
    currentCount: { type: "integer", minimum: 0 },
    modulus: { type: "integer", minimum: 1 },
  },
  required: ["previousCount", "currentCount", "modulus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardIncrement: { type: "integer" },
    wrapped: { type: "boolean" },
  },
  required: ["forwardIncrement", "wrapped"],
} as const;
/** Compute a forward modular counter increment under an explicit modulus and at-most-one-wrap assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCount, currentCount, modulus } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(modulus) &&
        modulus >= 1 &&
        modulus <= Number.MAX_SAFE_INTEGER,
      "modulus",
    ),
      modulus);
    (H.domain(
      Number.isSafeInteger(previousCount) &&
        previousCount >= 0 &&
        previousCount <= modulus - 1,
      "previousCount",
    ),
      previousCount);
    (H.domain(
      Number.isSafeInteger(currentCount) &&
        currentCount >= 0 &&
        currentCount <= modulus - 1,
      "currentCount",
    ),
      currentCount);
    return {
      forwardIncrement:
        currentCount >= previousCount
          ? currentCount - previousCount
          : modulus - previousCount + currentCount,
      wrapped: currentCount < previousCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousCount: 98, currentCount: 3, modulus: 100 },
  output: { forwardIncrement: 5, wrapped: true },
} satisfies ToolExample<Input, Output>;
export const agcontrollerCounterRolloverTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrotechnology", "agriculture"],
      keywords: ["agrotechnology", "agriculture"],
    },
    id: "agrotechnology/agricultural-controller-counter-rollover",
    title: "Agricultural Controller Counter Rollover",
    description:
      "Compute a forward modular counter increment under an explicit modulus and at-most-one-wrap assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousCount: { type: "integer", minimum: 0 },
        currentCount: { type: "integer", minimum: 0 },
        modulus: { type: "integer", minimum: 1 },
      },
      required: ["previousCount", "currentCount", "modulus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forwardIncrement: { type: "integer" },
        wrapped: { type: "boolean" },
      },
      required: ["forwardIncrement", "wrapped"],
    },
    ports: {
      inputs: [
        {
          id: "previousCount",
          label: "Previous Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "currentCount",
          label: "Current Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "modulus",
          label: "Modulus",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "forwardIncrement",
          label: "Forward Increment",
          valueType: { type: "integer" },
        },
        { id: "wrapped", label: "Wrapped", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = agcontrollerCounterRolloverTool.execute;
export default agcontrollerCounterRolloverTool;
