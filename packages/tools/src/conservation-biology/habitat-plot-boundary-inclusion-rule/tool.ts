import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly lowerBound: number;
  readonly upperBound: number;
  readonly includeUpper: boolean;
};
export type Output = { readonly included: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    lowerBound: { type: "number" },
    upperBound: { type: "number" },
    includeUpper: { type: "boolean" },
  },
  required: ["coordinate", "lowerBound", "upperBound", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { included: { type: "boolean" } },
  required: ["included"],
} as const;
/** Evaluate one supplied habitat-plot coordinate against an inclusive lower bound and an explicit upper-endpoint inclusion policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, lowerBound, upperBound, includeUpper } = request;
  const compute = (): Output => {
    H.domain(upperBound >= lowerBound, "upperBound");
    return {
      included:
        coordinate >= lowerBound &&
        (includeUpper ? coordinate <= upperBound : coordinate < upperBound),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 10, lowerBound: 0, upperBound: 10, includeUpper: false },
  output: { included: false },
} satisfies ToolExample<Input, Output>;
export const habitatPlotBoundaryInclusionRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["conservation-biology", "conservation biology", "biology"],
      keywords: ["conservation biology", "biology"],
    },
    id: "conservation-biology/habitat-plot-boundary-inclusion-rule",
    title: "Habitat Plot Boundary Inclusion Rule",
    description:
      "Evaluate one supplied habitat-plot coordinate against an inclusive lower bound and an explicit upper-endpoint inclusion policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        lowerBound: { type: "number" },
        upperBound: { type: "number" },
        includeUpper: { type: "boolean" },
      },
      required: ["coordinate", "lowerBound", "upperBound", "includeUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { included: { type: "boolean" } },
      required: ["included"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
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
        { id: "included", label: "Included", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = habitatPlotBoundaryInclusionRuleTool.execute;
export default habitatPlotBoundaryInclusionRuleTool;
