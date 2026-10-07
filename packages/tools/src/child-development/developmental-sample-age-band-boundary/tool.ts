import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageDays: number;
  readonly lowerInclusiveDays: number;
  readonly upperExclusiveDays: number;
};
export type Output = { readonly withinBand: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer", minimum: 0 },
    lowerInclusiveDays: { type: "integer", minimum: 0 },
    upperExclusiveDays: { type: "integer" },
  },
  required: ["ageDays", "lowerInclusiveDays", "upperExclusiveDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinBand: { type: "boolean" } },
  required: ["withinBand"],
} as const;
/** Check supplied study age in days against explicit half-open sampling bounds without defining developmental stages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageDays, lowerInclusiveDays, upperExclusiveDays } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(ageDays) &&
        ageDays >= 0 &&
        ageDays <= Number.MAX_SAFE_INTEGER,
      "ageDays",
    ),
      ageDays);
    (H.domain(
      Number.isSafeInteger(lowerInclusiveDays) &&
        lowerInclusiveDays >= 0 &&
        lowerInclusiveDays <= Number.MAX_SAFE_INTEGER,
      "lowerInclusiveDays",
    ),
      lowerInclusiveDays);
    (H.domain(
      Number.isSafeInteger(upperExclusiveDays) &&
        upperExclusiveDays >= lowerInclusiveDays + 1 &&
        upperExclusiveDays <= Number.MAX_SAFE_INTEGER,
      "upperExclusiveDays",
    ),
      upperExclusiveDays);
    return {
      withinBand: ageDays >= lowerInclusiveDays && ageDays < upperExclusiveDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ageDays: 200, lowerInclusiveDays: 180, upperExclusiveDays: 365 },
  output: { withinBand: true },
} satisfies ToolExample<Input, Output>;
export const developmentalSampleAgeBandBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/developmental-sample-age-band-boundary",
    title: "Developmental Sample Age Band Boundary",
    description:
      "Check supplied study age in days against explicit half-open sampling bounds without defining developmental stages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "integer", minimum: 0 },
        lowerInclusiveDays: { type: "integer", minimum: 0 },
        upperExclusiveDays: { type: "integer" },
      },
      required: ["ageDays", "lowerInclusiveDays", "upperExclusiveDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinBand: { type: "boolean" } },
      required: ["withinBand"],
    },
    ports: {
      inputs: [
        {
          id: "ageDays",
          label: "Age Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lowerInclusiveDays",
          label: "Lower Inclusive Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "upperExclusiveDays",
          label: "Upper Exclusive Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "withinBand",
          label: "Within Band",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = developmentalSampleAgeBandBoundaryTool.execute;
export default developmentalSampleAgeBandBoundaryTool;
