import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalUnits: number;
  readonly returnedUnits: number;
  readonly destroyedUnits: number;
  readonly overlapUnits: number;
};
export type Output = {
  readonly uniqueRecovered: number;
  readonly outstanding: number;
  readonly recoveredFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalUnits: { type: "integer", minimum: 0 },
    returnedUnits: { type: "integer", minimum: 0 },
    destroyedUnits: { type: "integer", minimum: 0 },
    overlapUnits: { type: "integer", minimum: 0 },
  },
  required: [
    "originalUnits",
    "returnedUnits",
    "destroyedUnits",
    "overlapUnits",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueRecovered: { type: "integer" },
    outstanding: { type: "integer" },
    recoveredFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["uniqueRecovered", "outstanding", "recoveredFraction", "defined"],
} as const;
/** Calculate recall quantity original base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalUnits, returnedUnits, destroyedUnits, overlapUnits } =
    request;
  const compute = (): Output => {
    H.integer(originalUnits, 0);
    H.integer(returnedUnits, 0, originalUnits);
    H.integer(destroyedUnits, 0, originalUnits);
    H.integer(overlapUnits, 0, Math.min(returnedUnits, destroyedUnits));
    H.domain(returnedUnits + destroyedUnits - overlapUnits <= originalUnits);
    return {
      uniqueRecovered: returnedUnits + destroyedUnits - overlapUnits,
      outstanding:
        originalUnits - returnedUnits - destroyedUnits + overlapUnits,
      recoveredFraction:
        originalUnits > 0
          ? (returnedUnits + destroyedUnits - overlapUnits) / originalUnits
          : 0,
      defined: originalUnits > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalUnits: 100,
    returnedUnits: 50,
    destroyedUnits: 30,
    overlapUnits: 10,
  },
  output: {
    uniqueRecovered: 70,
    outstanding: 30,
    recoveredFraction: 0.7,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const recallQuantityOriginalBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/recall-quantity-original-base",
    title: "Recall Quantity Original Base Tool",
    description:
      "Calculate recall quantity original base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalUnits: { type: "integer", minimum: 0 },
        returnedUnits: { type: "integer", minimum: 0 },
        destroyedUnits: { type: "integer", minimum: 0 },
        overlapUnits: { type: "integer", minimum: 0 },
      },
      required: [
        "originalUnits",
        "returnedUnits",
        "destroyedUnits",
        "overlapUnits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueRecovered: { type: "integer" },
        outstanding: { type: "integer" },
        recoveredFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "uniqueRecovered",
        "outstanding",
        "recoveredFraction",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "originalUnits",
          label: "Original Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returnedUnits",
          label: "Returned Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "destroyedUnits",
          label: "Destroyed Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "overlapUnits",
          label: "Overlap Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "uniqueRecovered",
          label: "Unique Recovered",
          valueType: { type: "integer" },
        },
        {
          id: "outstanding",
          label: "Outstanding",
          valueType: { type: "integer" },
        },
        {
          id: "recoveredFraction",
          label: "Recovered Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = recallQuantityOriginalBaseTool.execute;
export default recallQuantityOriginalBaseTool;
