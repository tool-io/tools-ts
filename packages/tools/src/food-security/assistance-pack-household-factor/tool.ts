import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packUnits: number;
  readonly households: number;
  readonly unitsPerHousehold: number;
};
export type Output = {
  readonly householdEquivalent: number;
  readonly coverageFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packUnits: { type: "number", minimum: 0 },
    households: { type: "integer", minimum: 1 },
    unitsPerHousehold: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["packUnits", "households", "unitsPerHousehold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    householdEquivalent: { type: "number" },
    coverageFactor: { type: "number" },
  },
  required: ["householdEquivalent", "coverageFactor"],
} as const;
/** Compare explicit assistance inventory quantities with a declared accounting basis without prescribing nutrition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packUnits, households, unitsPerHousehold } = request;
  const compute = (): Output => {
    H.domain(packUnits >= 0);
    H.integer(households, 1);
    H.positive(unitsPerHousehold);
    return {
      householdEquivalent: packUnits / unitsPerHousehold,
      coverageFactor: packUnits / unitsPerHousehold / households,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packUnits: 100, households: 20, unitsPerHousehold: 4 },
  output: { householdEquivalent: 25, coverageFactor: 1.25 },
} satisfies ToolExample<Input, Output>;
export const assistancePackHouseholdFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/assistance-pack-household-factor",
    title: "Assistance Pack Household Factor Tool",
    description:
      "Compare explicit assistance inventory quantities with a declared accounting basis without prescribing nutrition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packUnits: { type: "number", minimum: 0 },
        households: { type: "integer", minimum: 1 },
        unitsPerHousehold: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["packUnits", "households", "unitsPerHousehold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        householdEquivalent: { type: "number" },
        coverageFactor: { type: "number" },
      },
      required: ["householdEquivalent", "coverageFactor"],
    },
    ports: {
      inputs: [
        {
          id: "packUnits",
          label: "Pack Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "households",
          label: "Households",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitsPerHousehold",
          label: "Units Per Household",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "householdEquivalent",
          label: "Household Equivalent",
          valueType: { type: "number" },
        },
        {
          id: "coverageFactor",
          label: "Coverage Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assistancePackHouseholdFactorTool.execute;
export default assistancePackHouseholdFactorTool;
