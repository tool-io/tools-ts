import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cartonVolume: number;
  readonly quantity: number;
  readonly loadCapacity: number;
};
export type Output = {
  readonly occupiedVolume: number;
  readonly contributionFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cartonVolume: { type: "number", minimum: 0 },
    quantity: { type: "integer", minimum: 0 },
    loadCapacity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["cartonVolume", "quantity", "loadCapacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedVolume: { type: "number" },
    contributionFraction: { type: "number" },
  },
  required: ["occupiedVolume", "contributionFraction"],
} as const;
/** Calculate load cube one carton contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cartonVolume, quantity, loadCapacity } = request;
  const compute = (): Output => {
    H.domain(cartonVolume >= 0);
    H.integer(quantity, 0);
    H.positive(loadCapacity);
    return {
      occupiedVolume: cartonVolume * quantity,
      contributionFraction: (cartonVolume * quantity) / loadCapacity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cartonVolume: 0.1, quantity: 20, loadCapacity: 10 },
  output: { occupiedVolume: 2, contributionFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const loadCubeOneCartonContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/load-cube-one-carton-contribution",
    title: "Load Cube One Carton Contribution Tool",
    description:
      "Calculate load cube one carton contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cartonVolume: { type: "number", minimum: 0 },
        quantity: { type: "integer", minimum: 0 },
        loadCapacity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["cartonVolume", "quantity", "loadCapacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedVolume: { type: "number" },
        contributionFraction: { type: "number" },
      },
      required: ["occupiedVolume", "contributionFraction"],
    },
    ports: {
      inputs: [
        {
          id: "cartonVolume",
          label: "Carton Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "loadCapacity",
          label: "Load Capacity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "occupiedVolume",
          label: "Occupied Volume",
          valueType: { type: "number" },
        },
        {
          id: "contributionFraction",
          label: "Contribution Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = loadCubeOneCartonContributionTool.execute;
export default loadCubeOneCartonContributionTool;
