import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocated: number;
  readonly unit: string;
  readonly expectedUnit: string;
  readonly suppliedConversion: number;
  readonly conversionKnown: boolean;
};
export type Output = {
  readonly comparable: boolean;
  readonly normalized: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocated: { type: "number" },
    unit: { type: "string", maxLength: 8192 },
    expectedUnit: { type: "string", maxLength: 8192 },
    suppliedConversion: { type: "number", exclusiveMinimum: 0 },
    conversionKnown: { type: "boolean" },
  },
  required: [
    "allocated",
    "unit",
    "expectedUnit",
    "suppliedConversion",
    "conversionKnown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    comparable: { type: "boolean" },
    normalized: { type: "number" },
  },
  required: ["comparable", "normalized"],
} as const;
/** Check an explicitly supplied participatory-budget unit conversion without inferring voting value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocated, unit, expectedUnit, suppliedConversion, conversionKnown } =
    request;
  const compute = (): Output => {
    H.domain(suppliedConversion > 0);
    const comparable = unit === expectedUnit || conversionKnown;
    return {
      comparable,
      normalized: comparable
        ? allocated * (unit === expectedUnit ? 1 : suppliedConversion)
        : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    allocated: 100,
    unit: "credits",
    expectedUnit: "currency",
    suppliedConversion: 2,
    conversionKnown: true,
  },
  output: { comparable: true, normalized: 200 },
} satisfies ToolExample<Input, Output>;
export const residentBallotBudgetUnitTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/resident-ballot-budget-unit-token",
    title: "Resident Ballot Budget Unit Token Tool",
    description:
      "Check an explicitly supplied participatory-budget unit conversion without inferring voting value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocated: { type: "number" },
        unit: { type: "string", maxLength: 8192 },
        expectedUnit: { type: "string", maxLength: 8192 },
        suppliedConversion: { type: "number", exclusiveMinimum: 0 },
        conversionKnown: { type: "boolean" },
      },
      required: [
        "allocated",
        "unit",
        "expectedUnit",
        "suppliedConversion",
        "conversionKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        comparable: { type: "boolean" },
        normalized: { type: "number" },
      },
      required: ["comparable", "normalized"],
    },
    ports: {
      inputs: [
        {
          id: "allocated",
          label: "Allocated",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedUnit",
          label: "Expected Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedConversion",
          label: "Supplied Conversion",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "conversionKnown",
          label: "Conversion Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "comparable",
          label: "Comparable",
          valueType: { type: "boolean" },
        },
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = residentBallotBudgetUnitTokenTool.execute;
export default residentBallotBudgetUnitTokenTool;
