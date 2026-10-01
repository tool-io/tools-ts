import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly base: number; readonly exponent: number };
export type Output = {
  readonly negative: boolean;
  readonly evenPower: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "integer" },
    exponent: { type: "integer", minimum: 1 },
  },
  required: ["base", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { negative: { type: "boolean" }, evenPower: { type: "boolean" } },
  required: ["negative", "evenPower"],
} as const;
/** Calculate integer perfect power parity witness from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { base, exponent } = request;
  const compute = (): Output => {
    H.integer(exponent, 1);
    return {
      negative: base < 0 && exponent % 2 === 1,
      evenPower: exponent % 2 === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { base: -3, exponent: 4 },
  output: { negative: false, evenPower: true },
} satisfies ToolExample<Input, Output>;
export const integerPerfectPowerParityWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-perfect-power-parity-witness",
    title: "Integer Perfect Power Parity Witness Tool",
    description:
      "Calculate integer perfect power parity witness from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "integer" },
        exponent: { type: "integer", minimum: 1 },
      },
      required: ["base", "exponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        negative: { type: "boolean" },
        evenPower: { type: "boolean" },
      },
      required: ["negative", "evenPower"],
    },
    ports: {
      inputs: [
        {
          id: "base",
          label: "Base",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "negative", label: "Negative", valueType: { type: "boolean" } },
        {
          id: "evenPower",
          label: "Even Power",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = integerPerfectPowerParityWitnessTool.execute;
export default integerPerfectPowerParityWitnessTool;
