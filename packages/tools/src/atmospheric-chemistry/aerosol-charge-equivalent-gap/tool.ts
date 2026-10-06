import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cationEquivalents: number;
  readonly anionEquivalents: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cationEquivalents: { type: "number" },
    anionEquivalents: { type: "number" },
  },
  required: ["cationEquivalents", "anionEquivalents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied anion minus cation charge equivalents in consistent units without assigning chemical species. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cationEquivalents, anionEquivalents } = request;
  const compute = (): Output => {
    return { signedGap: anionEquivalents - cationEquivalents };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cationEquivalents: 12, anionEquivalents: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const aerosolChargeEquivalentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-chemistry", "atmospheric chemistry", "chemistry"],
      keywords: ["atmospheric chemistry", "chemistry"],
    },
    id: "atmospheric-chemistry/aerosol-charge-equivalent-gap",
    title: "Aerosol Charge Equivalent Gap",
    description:
      "Calculate supplied anion minus cation charge equivalents in consistent units without assigning chemical species.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cationEquivalents: { type: "number" },
        anionEquivalents: { type: "number" },
      },
      required: ["cationEquivalents", "anionEquivalents"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "cationEquivalents",
          label: "Cation Equivalents",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anionEquivalents",
          label: "Anion Equivalents",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = aerosolChargeEquivalentGapTool.execute;
export default aerosolChargeEquivalentGapTool;
