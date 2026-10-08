import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lumenArea: number;
  readonly totalSectionArea: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lumenArea: { type: "number", minimum: 0 },
    totalSectionArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["lumenArea", "totalSectionArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate a supplied organoid lumen area fraction and non-lumen area in one positive section without inferring volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lumenArea, totalSectionArea } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalSectionArea) && totalSectionArea > 0,
      "totalSectionArea",
    ),
      totalSectionArea);
    H.domain(lumenArea >= 0 && lumenArea <= totalSectionArea, "lumenArea");
    return {
      fraction: lumenArea / totalSectionArea,
      remainder: totalSectionArea - lumenArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lumenArea: 30, totalSectionArea: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const organoidLumenCrossSectionAreaFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-biology/organoid-lumen-cross-section-area-fraction",
      title: "Organoid Lumen Cross Section Area Fraction Tool",
      description:
        "Calculate a supplied organoid lumen area fraction and non-lumen area in one positive section without inferring volume.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lumenArea: { type: "number", minimum: 0 },
          totalSectionArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["lumenArea", "totalSectionArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fraction: { type: "number" },
          remainder: { type: "number" },
        },
        required: ["fraction", "remainder"],
      },
      ports: {
        inputs: [
          {
            id: "lumenArea",
            label: "Lumen Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalSectionArea",
            label: "Total Section Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = organoidLumenCrossSectionAreaFractionTool.execute;
export default organoidLumenCrossSectionAreaFractionTool;
