import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly suppliedUnit: string;
  readonly expectedUnit: string;
};
export type Output = {
  readonly reciprocal: number;
  readonly unitMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    suppliedUnit: { type: "string", maxLength: 8192 },
    expectedUnit: { type: "string", maxLength: 8192 },
  },
  required: ["token", "suppliedUnit", "expectedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reciprocal: { type: "integer" },
    unitMatches: { type: "boolean" },
  },
  required: ["reciprocal", "unitMatches"],
} as const;
/** Parse an explicit reciprocal-dilution token and compare supplied unit labels; no assay threshold is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, suppliedUnit, expectedUnit } = request;
  const compute = (): Output => {
    const match = /^1:([1-9]\d*)(?![\s\S])/.exec(token);
    H.domain(match, "token");
    const reciprocal = Number(match[1]);
    H.integer(reciprocal, 1);
    return { reciprocal, unitMatches: suppliedUnit === expectedUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "1:100", suppliedUnit: "dilution", expectedUnit: "dilution" },
  output: { reciprocal: 100, unitMatches: true },
} satisfies ToolExample<Input, Output>;
export const hormoneAssayDilutionTiterUnitTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/hormone-assay-dilution-titer-unit-token",
    title: "Hormone Assay Dilution Titer Unit Token Tool",
    description:
      "Parse an explicit reciprocal-dilution token and compare supplied unit labels; no assay threshold is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        suppliedUnit: { type: "string", maxLength: 8192 },
        expectedUnit: { type: "string", maxLength: 8192 },
      },
      required: ["token", "suppliedUnit", "expectedUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reciprocal: { type: "integer" },
        unitMatches: { type: "boolean" },
      },
      required: ["reciprocal", "unitMatches"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedUnit",
          label: "Supplied Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedUnit",
          label: "Expected Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "reciprocal",
          label: "Reciprocal",
          valueType: { type: "integer" },
        },
        {
          id: "unitMatches",
          label: "Unit Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = hormoneAssayDilutionTiterUnitTokenTool.execute;
export default hormoneAssayDilutionTiterUnitTokenTool;
