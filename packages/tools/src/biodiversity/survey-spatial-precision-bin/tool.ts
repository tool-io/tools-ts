import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly uncertaintyMeters: number;
  readonly upperBoundsMeters: readonly number[];
  readonly labels: readonly string[];
};
export type Output = { readonly precisionBin: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncertaintyMeters: { type: "number", minimum: 0 },
    upperBoundsMeters: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["uncertaintyMeters", "upperBoundsMeters", "labels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { precisionBin: { type: "string", maxLength: 8192 } },
  required: ["precisionBin"],
} as const;
/** Bin an explicit spatial uncertainty using caller-defined inclusive upper bounds; labels do not certify coordinate quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { uncertaintyMeters, upperBoundsMeters, labels } = request;
  const compute = (): Output => {
    H.domain(uncertaintyMeters >= 0, "uncertaintyMeters");
    H.domain(labels.length === upperBoundsMeters.length + 1, "labels");
    upperBoundsMeters.forEach((v, i) =>
      H.domain(
        v >= 0 && (i === 0 || v > upperBoundsMeters[i - 1]),
        "upperBoundsMeters",
      ),
    );
    let index = 0;
    while (
      index < upperBoundsMeters.length &&
      uncertaintyMeters > upperBoundsMeters[index]
    )
      index++;
    return { precisionBin: labels[index] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    uncertaintyMeters: 50,
    upperBoundsMeters: [10, 100],
    labels: ["fine", "medium", "coarse"],
  },
  output: { precisionBin: "medium" },
} satisfies ToolExample<Input, Output>;
export const surveySpatialPrecisionBinTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/survey-spatial-precision-bin",
    title: "Survey Spatial Precision Bin",
    description:
      "Bin an explicit spatial uncertainty using caller-defined inclusive upper bounds; labels do not certify coordinate quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncertaintyMeters: { type: "number", minimum: 0 },
        upperBoundsMeters: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["uncertaintyMeters", "upperBoundsMeters", "labels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { precisionBin: { type: "string", maxLength: 8192 } },
      required: ["precisionBin"],
    },
    ports: {
      inputs: [
        {
          id: "uncertaintyMeters",
          label: "Uncertainty Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperBoundsMeters",
          label: "Upper Bounds Meters",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "precisionBin",
          label: "Precision Bin",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = surveySpatialPrecisionBinTool.execute;
export default surveySpatialPrecisionBinTool;
