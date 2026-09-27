import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oxidePercent: number;
  readonly totalPercent: number;
  readonly volatilePercent: number;
  readonly targetTotal: number;
};
export type Output = {
  readonly nonvolatileTotal: number;
  readonly normalizedPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oxidePercent: { type: "number", minimum: 0 },
    totalPercent: { type: "number" },
    volatilePercent: { type: "number", minimum: 0 },
    targetTotal: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["oxidePercent", "totalPercent", "volatilePercent", "targetTotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nonvolatileTotal: { type: "number" },
    normalizedPercent: { type: "number" },
  },
  required: ["nonvolatileTotal", "normalizedPercent"],
} as const;
/** Calculate geochemical volatile free normalization term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oxidePercent, totalPercent, volatilePercent, targetTotal } = request;
  const compute = (): Output => {
    H.domain(
      oxidePercent >= 0 &&
        volatilePercent >= 0 &&
        totalPercent > volatilePercent &&
        oxidePercent <= totalPercent - volatilePercent,
    );
    H.positive(targetTotal);
    return {
      nonvolatileTotal: totalPercent - volatilePercent,
      normalizedPercent:
        (oxidePercent * targetTotal) / (totalPercent - volatilePercent),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oxidePercent: 45,
    totalPercent: 100,
    volatilePercent: 10,
    targetTotal: 100,
  },
  output: { nonvolatileTotal: 90, normalizedPercent: 50 },
} satisfies ToolExample<Input, Output>;
export const geochemicalVolatileFreeNormalizationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/geochemical-volatile-free-normalization-term",
      title: "Geochemical Volatile Free Normalization Term Tool",
      description:
        "Calculate geochemical volatile free normalization term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oxidePercent: { type: "number", minimum: 0 },
          totalPercent: { type: "number" },
          volatilePercent: { type: "number", minimum: 0 },
          targetTotal: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "oxidePercent",
          "totalPercent",
          "volatilePercent",
          "targetTotal",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nonvolatileTotal: { type: "number" },
          normalizedPercent: { type: "number" },
        },
        required: ["nonvolatileTotal", "normalizedPercent"],
      },
      ports: {
        inputs: [
          {
            id: "oxidePercent",
            label: "Oxide Percent",
            required: true,
            valueType: { type: "number", unit: "%" },
          },
          {
            id: "totalPercent",
            label: "Total Percent",
            required: true,
            valueType: { type: "number", unit: "%" },
          },
          {
            id: "volatilePercent",
            label: "Volatile Percent",
            required: true,
            valueType: { type: "number", unit: "%" },
          },
          {
            id: "targetTotal",
            label: "Target Total",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "nonvolatileTotal",
            label: "Nonvolatile Total",
            valueType: { type: "number" },
          },
          {
            id: "normalizedPercent",
            label: "Normalized Percent",
            valueType: { type: "number", unit: "%" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geochemicalVolatileFreeNormalizationTermTool.execute;
export default geochemicalVolatileFreeNormalizationTermTool;
