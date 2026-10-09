import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly indicatorId: string;
  readonly populationBasis: string;
  readonly referenceDateText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indicatorId: { type: "string", maxLength: 8192, minLength: 1 },
    populationBasis: { type: "string", maxLength: 8192, minLength: 1 },
    referenceDateText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["indicatorId", "populationBasis", "referenceDateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit international indicator population basis and reference-date transcription without harmonizing statistics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { indicatorId, populationBasis, referenceDateText } = request;
  const compute = (): Output => {
    H.domain(indicatorId.length > 0, "indicatorId");
    H.domain(populationBasis.length > 0, "populationBasis");
    H.domain(referenceDateText.length > 0, "referenceDateText");
    return {
      token: JSON.stringify([indicatorId, populationBasis, referenceDateText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    indicatorId: "I17",
    populationBasis: "resident population",
    referenceDateText: "2025-07-01",
  },
  output: { token: '["I17","resident population","2025-07-01"]' },
} satisfies ToolExample<Input, Output>;
export const internationalIndicatorPopulationReferenceDateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/international-indicator-population-reference-date",
      title: "International Indicator Population Reference Date Tool",
      description:
        "Preserve explicit international indicator population basis and reference-date transcription without harmonizing statistics.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          indicatorId: { type: "string", maxLength: 8192, minLength: 1 },
          populationBasis: { type: "string", maxLength: 8192, minLength: 1 },
          referenceDateText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["indicatorId", "populationBasis", "referenceDateText"],
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
            id: "indicatorId",
            label: "Indicator Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "populationBasis",
            label: "Population Basis",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "referenceDateText",
            label: "Reference Date Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = internationalIndicatorPopulationReferenceDateTool.execute;
export default internationalIndicatorPopulationReferenceDateTool;
