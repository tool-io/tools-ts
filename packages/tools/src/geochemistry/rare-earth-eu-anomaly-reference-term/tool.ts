import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly normalizedEu: number;
  readonly normalizedSm: number;
  readonly normalizedGd: number;
};
export type Output = { readonly euAnomaly: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedEu: { type: "number", minimum: 0 },
    normalizedSm: { type: "number", exclusiveMinimum: 0 },
    normalizedGd: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["normalizedEu", "normalizedSm", "normalizedGd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { euAnomaly: { type: "number" } },
  required: ["euAnomaly"],
} as const;
/** Calculate Eu/Eu-star using explicitly reference-normalized Eu divided by the geometric mean of normalized Sm and Gd. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { normalizedEu, normalizedSm, normalizedGd } = request;
  const compute = (): Output => {
    H.domain(normalizedEu >= 0, "normalizedEu");
    (H.domain(
      Number.isFinite(normalizedSm) && normalizedSm > 0,
      "normalizedSm",
    ),
      normalizedSm);
    (H.domain(
      Number.isFinite(normalizedGd) && normalizedGd > 0,
      "normalizedGd",
    ),
      normalizedGd);
    return {
      euAnomaly:
        normalizedEu / Math.sqrt(normalizedSm) / Math.sqrt(normalizedGd),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { normalizedEu: 2, normalizedSm: 1, normalizedGd: 4 },
  output: { euAnomaly: 1 },
} satisfies ToolExample<Input, Output>;
export const rareEarthEuAnomalyReferenceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/rare-earth-eu-anomaly-reference-term",
    title: "Rare Earth Eu Anomaly Reference Term Tool",
    description:
      "Calculate Eu/Eu-star using explicitly reference-normalized Eu divided by the geometric mean of normalized Sm and Gd.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedEu: { type: "number", minimum: 0 },
        normalizedSm: { type: "number", exclusiveMinimum: 0 },
        normalizedGd: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["normalizedEu", "normalizedSm", "normalizedGd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { euAnomaly: { type: "number" } },
      required: ["euAnomaly"],
    },
    ports: {
      inputs: [
        {
          id: "normalizedEu",
          label: "Normalized Eu",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "normalizedSm",
          label: "Normalized Sm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "normalizedGd",
          label: "Normalized Gd",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "euAnomaly", label: "Eu Anomaly", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rareEarthEuAnomalyReferenceTermTool.execute;
export default rareEarthEuAnomalyReferenceTermTool;
