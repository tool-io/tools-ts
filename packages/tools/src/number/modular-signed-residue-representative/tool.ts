import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integer: number;
  readonly modulus: number;
  readonly positiveTie: boolean;
};
export type Output = { readonly representative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integer: { type: "integer" },
    modulus: { type: "integer", minimum: 1 },
    positiveTie: { type: "boolean" },
  },
  required: ["integer", "modulus", "positiveTie"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { representative: { type: "integer" } },
  required: ["representative"],
} as const;
/** Calculate modular signed residue representative from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integer, modulus, positiveTie } = request;
  const compute = (): Output => {
    H.integer(modulus, 1);
    const r = H.mod(integer, modulus);
    return {
      representative:
        r > modulus / 2 || (r === modulus / 2 && !positiveTie)
          ? r - modulus
          : r,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integer: 7, modulus: 10, positiveTie: true },
  output: { representative: -3 },
} satisfies ToolExample<Input, Output>;
export const modularSignedResidueRepresentativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/modular-signed-residue-representative",
    title: "Modular Signed Residue Representative Tool",
    description:
      "Calculate modular signed residue representative from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integer: { type: "integer" },
        modulus: { type: "integer", minimum: 1 },
        positiveTie: { type: "boolean" },
      },
      required: ["integer", "modulus", "positiveTie"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { representative: { type: "integer" } },
      required: ["representative"],
    },
    ports: {
      inputs: [
        {
          id: "integer",
          label: "Integer",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "modulus",
          label: "Modulus",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "positiveTie",
          label: "Positive Tie",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "representative",
          label: "Representative",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = modularSignedResidueRepresentativeTool.execute;
export default modularSignedResidueRepresentativeTool;
