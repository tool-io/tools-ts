import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityUnits: number;
  readonly proteinMassMilligrams: number;
};
export type Output = { readonly unitsPerMilligram: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityUnits: { type: "number", minimum: 0 },
    proteinMassMilligrams: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["activityUnits", "proteinMassMilligrams"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unitsPerMilligram: { type: "number" } },
  required: ["unitsPerMilligram"],
} as const;
/** Compute a recorded purified fraction's specific enzyme activity from measured activity and protein mass, without prescribing assay conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityUnits, proteinMassMilligrams } = request;
  const compute = (): Output => {
    H.domain(activityUnits >= 0, "activityUnits");
    (H.domain(proteinMassMilligrams > 0, "proteinMassMilligrams"),
      proteinMassMilligrams);
    return { unitsPerMilligram: activityUnits / proteinMassMilligrams };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activityUnits: 120, proteinMassMilligrams: 4 },
  output: { unitsPerMilligram: 30 },
} satisfies ToolExample<Input, Output>;
export const purifiedFractionSpecificActivityPointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biotechnology/purified-fraction-specific-activity-point",
      title: "Purified Fraction Specific Activity Point Tool",
      description:
        "Compute a recorded purified fraction's specific enzyme activity from measured activity and protein mass, without prescribing assay conditions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activityUnits: { type: "number", minimum: 0 },
          proteinMassMilligrams: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["activityUnits", "proteinMassMilligrams"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { unitsPerMilligram: { type: "number" } },
        required: ["unitsPerMilligram"],
      },
      ports: {
        inputs: [
          {
            id: "activityUnits",
            label: "Activity Units",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "proteinMassMilligrams",
            label: "Protein Mass Milligrams",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unitsPerMilligram",
            label: "Units Per Milligram",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = purifiedFractionSpecificActivityPointTool.execute;
export default purifiedFractionSpecificActivityPointTool;
