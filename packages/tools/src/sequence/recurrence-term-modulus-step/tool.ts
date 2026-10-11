import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previous: number;
  readonly multiplier: number;
  readonly increment: number;
  readonly modulus: number;
};
export type Output = { readonly nextResidue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "integer" },
    multiplier: { type: "integer" },
    increment: { type: "integer" },
    modulus: { type: "integer", minimum: 1 },
  },
  required: ["previous", "multiplier", "increment", "modulus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextResidue: { type: "integer" } },
  required: ["nextResidue"],
} as const;
/** Evaluate one explicit affine integer recurrence step modulo a supplied positive modulus with exact multiplication. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previous, multiplier, increment, modulus } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previous) &&
        previous >= -Number.MAX_SAFE_INTEGER &&
        previous <= Number.MAX_SAFE_INTEGER,
      "previous",
    ),
      previous);
    (H.domain(
      Number.isSafeInteger(multiplier) &&
        multiplier >= -Number.MAX_SAFE_INTEGER &&
        multiplier <= Number.MAX_SAFE_INTEGER,
      "multiplier",
    ),
      multiplier);
    (H.domain(
      Number.isSafeInteger(increment) &&
        increment >= -Number.MAX_SAFE_INTEGER &&
        increment <= Number.MAX_SAFE_INTEGER,
      "increment",
    ),
      increment);
    (H.domain(
      Number.isSafeInteger(modulus) &&
        modulus >= 1 &&
        modulus <= Number.MAX_SAFE_INTEGER,
      "modulus",
    ),
      modulus);
    return {
      nextResidue: (() => {
        const n = BigInt(modulus),
          raw = (BigInt(previous) * BigInt(multiplier) + BigInt(increment)) % n;
        return Number(raw < 0n ? raw + n : raw);
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previous: 7, multiplier: 5, increment: 3, modulus: 11 },
  output: { nextResidue: 5 },
} satisfies ToolExample<Input, Output>;
export const recurrenceTermModulusStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["sequence", "mathematics"],
      keywords: ["sequence", "mathematics"],
    },
    id: "sequence/recurrence-term-modulus-step",
    title: "Recurrence Term Modulus Step",
    description:
      "Evaluate one explicit affine integer recurrence step modulo a supplied positive modulus with exact multiplication.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previous: { type: "integer" },
        multiplier: { type: "integer" },
        increment: { type: "integer" },
        modulus: { type: "integer", minimum: 1 },
      },
      required: ["previous", "multiplier", "increment", "modulus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nextResidue: { type: "integer" } },
      required: ["nextResidue"],
    },
    ports: {
      inputs: [
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "multiplier",
          label: "Multiplier",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "increment",
          label: "Increment",
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
          id: "nextResidue",
          label: "Next Residue",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = recurrenceTermModulusStepTool.execute;
export default recurrenceTermModulusStepTool;
