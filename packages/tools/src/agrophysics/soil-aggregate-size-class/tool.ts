import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diameter: number;
  readonly lowerBound: number;
  readonly upperBound: number;
  readonly includeUpper: boolean;
};
export type Output = { readonly inClass: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameter: { type: "number", minimum: 0 },
    lowerBound: { type: "number", minimum: 0 },
    upperBound: { type: "number" },
    includeUpper: { type: "boolean" },
  },
  required: ["diameter", "lowerBound", "upperBound", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inClass: { type: "boolean" } },
  required: ["inClass"],
} as const;
/** Classify one supplied aggregate diameter against explicit lower-inclusive and upper-policy size bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameter, lowerBound, upperBound, includeUpper } = request;
  const compute = (): Output => {
    H.domain(
      diameter >= 0 && lowerBound >= 0 && upperBound > lowerBound,
      "diameter",
    );
    return {
      inClass:
        diameter >= lowerBound &&
        (includeUpper ? diameter <= upperBound : diameter < upperBound),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameter: 2, lowerBound: 1, upperBound: 3, includeUpper: false },
  output: { inClass: true },
} satisfies ToolExample<Input, Output>;
export const soilAggregateSizeClassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrophysics", "agriculture"],
      keywords: ["agrophysics", "agriculture"],
    },
    id: "agrophysics/soil-aggregate-size-class",
    title: "Soil Aggregate Size Class",
    description:
      "Classify one supplied aggregate diameter against explicit lower-inclusive and upper-policy size bounds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameter: { type: "number", minimum: 0 },
        lowerBound: { type: "number", minimum: 0 },
        upperBound: { type: "number" },
        includeUpper: { type: "boolean" },
      },
      required: ["diameter", "lowerBound", "upperBound", "includeUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inClass: { type: "boolean" } },
      required: ["inClass"],
    },
    ports: {
      inputs: [
        {
          id: "diameter",
          label: "Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerBound",
          label: "Lower Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeUpper",
          label: "Include Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inClass", label: "In Class", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = soilAggregateSizeClassTool.execute;
export default soilAggregateSizeClassTool;
