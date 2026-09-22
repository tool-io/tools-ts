import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ph: number;
  readonly pka: number;
  readonly totalConcentration: number;
};
export type Output = {
  readonly baseAcidRatio: number;
  readonly acidConcentration: number;
  readonly baseConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ph: { type: "number" },
    pka: { type: "number" },
    totalConcentration: { type: "number", minimum: 0 },
  },
  required: ["ph", "pka", "totalConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseAcidRatio: { type: "number" },
    acidConcentration: { type: "number" },
    baseConcentration: { type: "number" },
  },
  required: ["baseAcidRatio", "acidConcentration", "baseConcentration"],
} as const;
/** Ideal monoprotic acid/base pair with activity effects excluded; no buffer preparation or treatment recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ph, pka, totalConcentration } = request;
  const compute = (): Output => {
    H.domain(totalConcentration >= 0);
    return {
      baseAcidRatio: 10 ** (ph - pka),
      acidConcentration: totalConcentration / (1 + 10 ** (ph - pka)),
      baseConcentration: totalConcentration / (1 + 10 ** (pka - ph)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ph: 7, pka: 6, totalConcentration: 11 },
  output: { baseAcidRatio: 10, acidConcentration: 1, baseConcentration: 10 },
} satisfies ToolExample<Input, Output>;
export const hendersonHasselbalchSpeciesRatioTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biochemistry/henderson-hasselbalch-species-ratio-term",
      title: "Henderson Hasselbalch Species Ratio Term Tool",
      description:
        "Ideal monoprotic acid/base pair with activity effects excluded; no buffer preparation or treatment recommendation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ph: { type: "number" },
          pka: { type: "number" },
          totalConcentration: { type: "number", minimum: 0 },
        },
        required: ["ph", "pka", "totalConcentration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseAcidRatio: { type: "number" },
          acidConcentration: { type: "number" },
          baseConcentration: { type: "number" },
        },
        required: ["baseAcidRatio", "acidConcentration", "baseConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "ph",
            label: "Ph",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pka",
            label: "Pka",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalConcentration",
            label: "Total Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "baseAcidRatio",
            label: "Base Acid Ratio",
            valueType: { type: "number" },
          },
          {
            id: "acidConcentration",
            label: "Acid Concentration",
            valueType: { type: "number" },
          },
          {
            id: "baseConcentration",
            label: "Base Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hendersonHasselbalchSpeciesRatioTermTool.execute;
export default hendersonHasselbalchSpeciesRatioTermTool;
