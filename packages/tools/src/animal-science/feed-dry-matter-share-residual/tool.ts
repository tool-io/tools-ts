import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly waterFraction: number;
  readonly suppliedDryMass: number;
};
export type Output = {
  readonly derivedDryMass: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    waterFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedDryMass: { type: "number", minimum: 0 },
  },
  required: ["wetMass", "waterFraction", "suppliedDryMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivedDryMass: { type: "number" },
    residual: { type: "number" },
  },
  required: ["derivedDryMass", "residual"],
} as const;
/** Compare supplied feed mass bases without formulating diets or recommending feed amounts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, waterFraction, suppliedDryMass } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0 && suppliedDryMass >= 0);
    H.probability(waterFraction);
    return {
      derivedDryMass: wetMass * (1 - waterFraction),
      residual: suppliedDryMass - wetMass * (1 - waterFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 100, waterFraction: 0.2, suppliedDryMass: 75 },
  output: { derivedDryMass: 80, residual: -5 },
} satisfies ToolExample<Input, Output>;
export const feedDryMatterShareResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/feed-dry-matter-share-residual",
    title: "Feed Dry Matter Share Residual Tool",
    description:
      "Compare supplied feed mass bases without formulating diets or recommending feed amounts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        waterFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedDryMass: { type: "number", minimum: 0 },
      },
      required: ["wetMass", "waterFraction", "suppliedDryMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        derivedDryMass: { type: "number" },
        residual: { type: "number" },
      },
      required: ["derivedDryMass", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterFraction",
          label: "Water Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDryMass",
          label: "Supplied Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivedDryMass",
          label: "Derived Dry Mass",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = feedDryMatterShareResidualTool.execute;
export default feedDryMatterShareResidualTool;
