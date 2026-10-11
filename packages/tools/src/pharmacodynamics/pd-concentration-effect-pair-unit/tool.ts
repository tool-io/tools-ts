import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pairId: string;
  readonly concentrationUnit: string;
  readonly effectUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pairId: { type: "string", maxLength: 8192, minLength: 1 },
    concentrationUnit: { type: "string", maxLength: 8192, minLength: 1 },
    effectUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["pairId", "concentrationUnit", "effectUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit concentration-effect pair by supplied units without estimating a relationship. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pairId, concentrationUnit, effectUnit } = request;
  const compute = (): Output => {
    H.domain(pairId.length > 0, "pairId");
    H.domain(concentrationUnit.length > 0, "concentrationUnit");
    H.domain(effectUnit.length > 0, "effectUnit");
    return { token: JSON.stringify([pairId, concentrationUnit, effectUnit]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pairId: "P17", concentrationUnit: "nM", effectUnit: "percent" },
  output: { token: '["P17","nM","percent"]' },
} satisfies ToolExample<Input, Output>;
export const pdConcentrationEffectPairUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacodynamics", "pharmacy"],
      keywords: ["pharmacodynamics", "pharmacy"],
    },
    id: "pharmacodynamics/pd-concentration-effect-pair-unit",
    title: "PD Concentration Effect Pair Unit",
    description:
      "Qualify an explicit concentration-effect pair by supplied units without estimating a relationship.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pairId: { type: "string", maxLength: 8192, minLength: 1 },
        concentrationUnit: { type: "string", maxLength: 8192, minLength: 1 },
        effectUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["pairId", "concentrationUnit", "effectUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "pairId",
          label: "Pair Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "concentrationUnit",
          label: "Concentration Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "effectUnit",
          label: "Effect Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pdConcentrationEffectPairUnitTool.execute;
export default pdConcentrationEffectPairUnitTool;
