import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstHead: number;
  readonly firstDependent: number;
  readonly secondHead: number;
  readonly secondDependent: number;
};
export type Output = { readonly crosses: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstHead: { type: "integer", minimum: 0 },
    firstDependent: { type: "integer", minimum: 0 },
    secondHead: { type: "integer", minimum: 0 },
    secondDependent: { type: "integer", minimum: 0 },
  },
  required: ["firstHead", "firstDependent", "secondHead", "secondDependent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { crosses: { type: "boolean" } },
  required: ["crosses"],
} as const;
/** Detect strict interleaving of two supplied dependency arcs; shared endpoints and nesting do not cross. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstHead, firstDependent, secondHead, secondDependent } = request;
  const compute = (): Output => {
    H.integer(firstHead, 0);
    H.integer(firstDependent, 0);
    H.integer(secondHead, 0);
    H.integer(secondDependent, 0);
    H.domain(firstHead !== firstDependent && secondHead !== secondDependent);
    return {
      crosses: (() => {
        const a = Math.min(firstHead, firstDependent),
          b = Math.max(firstHead, firstDependent),
          c = Math.min(secondHead, secondDependent),
          d = Math.max(secondHead, secondDependent);
        return (a < c && c < b && b < d) || (c < a && a < d && d < b);
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstHead: 1, firstDependent: 3, secondHead: 2, secondDependent: 4 },
  output: { crosses: true },
} satisfies ToolExample<Input, Output>;
export const dependencyProjectivityCrossingFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-linguistics/dependency-projectivity-crossing-flag",
    title: "Dependency Projectivity Crossing Flag Tool",
    description:
      "Detect strict interleaving of two supplied dependency arcs; shared endpoints and nesting do not cross.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstHead: { type: "integer", minimum: 0 },
        firstDependent: { type: "integer", minimum: 0 },
        secondHead: { type: "integer", minimum: 0 },
        secondDependent: { type: "integer", minimum: 0 },
      },
      required: [
        "firstHead",
        "firstDependent",
        "secondHead",
        "secondDependent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { crosses: { type: "boolean" } },
      required: ["crosses"],
    },
    ports: {
      inputs: [
        {
          id: "firstHead",
          label: "First Head",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstDependent",
          label: "First Dependent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondHead",
          label: "Second Head",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondDependent",
          label: "Second Dependent",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "crosses", label: "Crosses", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dependencyProjectivityCrossingFlagTool.execute;
export default dependencyProjectivityCrossingFlagTool;
