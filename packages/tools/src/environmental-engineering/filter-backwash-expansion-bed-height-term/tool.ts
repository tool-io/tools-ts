import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly settledHeight: number;
  readonly expansionFraction: number;
  readonly vesselHeight: number;
};
export type Output = {
  readonly expandedHeight: number;
  readonly freeboard: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    settledHeight: { type: "number", minimum: 0 },
    expansionFraction: { type: "number", minimum: 0 },
    vesselHeight: { type: "number", minimum: 0 },
  },
  required: ["settledHeight", "expansionFraction", "vesselHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expandedHeight: { type: "number" },
    freeboard: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["expandedHeight", "freeboard", "fits"],
} as const;
/** Calculate filter backwash expansion bed height term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { settledHeight, expansionFraction, vesselHeight } = request;
  const compute = (): Output => {
    H.domain(settledHeight >= 0 && expansionFraction >= 0 && vesselHeight >= 0);
    return {
      expandedHeight: settledHeight * (1 + expansionFraction),
      freeboard: vesselHeight - settledHeight * (1 + expansionFraction),
      fits: settledHeight * (1 + expansionFraction) <= vesselHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { settledHeight: 1, expansionFraction: 0.4, vesselHeight: 2 },
  output: { expandedHeight: 1.4, freeboard: 0.6000000000000001, fits: true },
} satisfies ToolExample<Input, Output>;
export const filterBackwashExpansionBedHeightTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/filter-backwash-expansion-bed-height-term",
      title: "Filter Backwash Expansion BED Height Term Tool",
      description:
        "Calculate filter backwash expansion bed height term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          settledHeight: { type: "number", minimum: 0 },
          expansionFraction: { type: "number", minimum: 0 },
          vesselHeight: { type: "number", minimum: 0 },
        },
        required: ["settledHeight", "expansionFraction", "vesselHeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expandedHeight: { type: "number" },
          freeboard: { type: "number" },
          fits: { type: "boolean" },
        },
        required: ["expandedHeight", "freeboard", "fits"],
      },
      ports: {
        inputs: [
          {
            id: "settledHeight",
            label: "Settled Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "expansionFraction",
            label: "Expansion Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "vesselHeight",
            label: "Vessel Height",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "expandedHeight",
            label: "Expanded Height",
            valueType: { type: "number" },
          },
          {
            id: "freeboard",
            label: "Freeboard",
            valueType: { type: "number" },
          },
          { id: "fits", label: "Fits", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = filterBackwashExpansionBedHeightTermTool.execute;
export default filterBackwashExpansionBedHeightTermTool;
