import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chronologicalDays: number;
  readonly gestationalDays: number;
  readonly fullTermDays: number;
};
export type Output = {
  readonly prematurityDays: number;
  readonly correctedDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chronologicalDays: { type: "integer", minimum: 0 },
    gestationalDays: { type: "integer", minimum: 1 },
    fullTermDays: { type: "integer", minimum: 1 },
  },
  required: ["chronologicalDays", "gestationalDays", "fullTermDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prematurityDays: { type: "integer" },
    correctedDays: { type: "integer" },
  },
  required: ["prematurityDays", "correctedDays"],
} as const;
/** Research age arithmetic using an explicit full-term anchor; negative corrected ages are retained, with no developmental diagnosis or clinical rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chronologicalDays, gestationalDays, fullTermDays } = request;
  const compute = (): Output => {
    H.integer(chronologicalDays, 0);
    H.integer(gestationalDays, 1);
    H.integer(fullTermDays, 1);
    return {
      prematurityDays: Math.max(0, fullTermDays - gestationalDays),
      correctedDays:
        chronologicalDays - Math.max(0, fullTermDays - gestationalDays),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chronologicalDays: 180, gestationalDays: 238, fullTermDays: 280 },
  output: { prematurityDays: 42, correctedDays: 138 },
} satisfies ToolExample<Input, Output>;
export const developmentalStudyCorrectedAgeAnchorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/developmental-study-corrected-age-anchor",
      title: "Developmental Study Corrected Age Anchor Tool",
      description:
        "Research age arithmetic using an explicit full-term anchor; negative corrected ages are retained, with no developmental diagnosis or clinical rule.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          chronologicalDays: { type: "integer", minimum: 0 },
          gestationalDays: { type: "integer", minimum: 1 },
          fullTermDays: { type: "integer", minimum: 1 },
        },
        required: ["chronologicalDays", "gestationalDays", "fullTermDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prematurityDays: { type: "integer" },
          correctedDays: { type: "integer" },
        },
        required: ["prematurityDays", "correctedDays"],
      },
      ports: {
        inputs: [
          {
            id: "chronologicalDays",
            label: "Chronological Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "gestationalDays",
            label: "Gestational Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "fullTermDays",
            label: "Full Term Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "prematurityDays",
            label: "Prematurity Days",
            valueType: { type: "integer" },
          },
          {
            id: "correctedDays",
            label: "Corrected Days",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = developmentalStudyCorrectedAgeAnchorTool.execute;
export default developmentalStudyCorrectedAgeAnchorTool;
