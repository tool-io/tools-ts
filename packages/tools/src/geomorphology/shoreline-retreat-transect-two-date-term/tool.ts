import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDistance: number;
  readonly secondDistance: number;
  readonly elapsedYears: number;
  readonly inlandPositive: boolean;
};
export type Output = {
  readonly retreat: number;
  readonly retreatPerYear: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDistance: { type: "number" },
    secondDistance: { type: "number" },
    elapsedYears: { type: "number", exclusiveMinimum: 0 },
    inlandPositive: { type: "boolean" },
  },
  required: [
    "firstDistance",
    "secondDistance",
    "elapsedYears",
    "inlandPositive",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retreat: { type: "number" },
    retreatPerYear: { type: "number" },
  },
  required: ["retreat", "retreatPerYear"],
} as const;
/** Endpoint shoreline change along one consistent transect, retreat positive under an explicit coordinate direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDistance, secondDistance, elapsedYears, inlandPositive } =
    request;
  const compute = (): Output => {
    H.positive(elapsedYears);
    return {
      retreat: (secondDistance - firstDistance) * (inlandPositive ? 1 : -1),
      retreatPerYear:
        ((secondDistance - firstDistance) * (inlandPositive ? 1 : -1)) /
        elapsedYears,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstDistance: 20,
    secondDistance: 35,
    elapsedYears: 5,
    inlandPositive: true,
  },
  output: { retreat: 15, retreatPerYear: 3 },
} satisfies ToolExample<Input, Output>;
export const shorelineRetreatTransectTwoDateTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geomorphology/shoreline-retreat-transect-two-date-term",
      title: "Shoreline Retreat Transect Two Date Term Tool",
      description:
        "Endpoint shoreline change along one consistent transect, retreat positive under an explicit coordinate direction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstDistance: { type: "number" },
          secondDistance: { type: "number" },
          elapsedYears: { type: "number", exclusiveMinimum: 0 },
          inlandPositive: { type: "boolean" },
        },
        required: [
          "firstDistance",
          "secondDistance",
          "elapsedYears",
          "inlandPositive",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retreat: { type: "number" },
          retreatPerYear: { type: "number" },
        },
        required: ["retreat", "retreatPerYear"],
      },
      ports: {
        inputs: [
          {
            id: "firstDistance",
            label: "First Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondDistance",
            label: "Second Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elapsedYears",
            label: "Elapsed Years",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inlandPositive",
            label: "Inland Positive",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "retreat", label: "Retreat", valueType: { type: "number" } },
          {
            id: "retreatPerYear",
            label: "Retreat Per Year",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = shorelineRetreatTransectTwoDateTermTool.execute;
export default shorelineRetreatTransectTwoDateTermTool;
