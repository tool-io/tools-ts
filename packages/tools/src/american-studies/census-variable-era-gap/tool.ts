import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEdition: number;
  readonly secondEdition: number;
  readonly firstDefinition: string;
  readonly secondDefinition: string;
};
export type Output = {
  readonly editionGapDecimal: string;
  readonly definitionChanged: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEdition: { type: "integer" },
    secondEdition: { type: "integer" },
    firstDefinition: { type: "string", maxLength: 8192 },
    secondDefinition: { type: "string", maxLength: 8192 },
  },
  required: [
    "firstEdition",
    "secondEdition",
    "firstDefinition",
    "secondDefinition",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionGapDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    definitionChanged: { type: "boolean" },
  },
  required: ["editionGapDecimal", "definitionChanged"],
} as const;
/** Compare supplied census edition and definition identifiers, without inferring comparability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEdition, secondEdition, firstDefinition, secondDefinition } =
    request;
  const compute = (): Output => {
    return {
      editionGapDecimal: (
        BigInt(secondEdition) - BigInt(firstEdition)
      ).toString(),
      definitionChanged: firstDefinition !== secondDefinition,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEdition: 2000,
    secondEdition: 2010,
    firstDefinition: "A",
    secondDefinition: "B",
  },
  output: { editionGapDecimal: "10", definitionChanged: true },
} satisfies ToolExample<Input, Output>;
export const censusVariableEraGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/census-variable-era-gap",
    title: "Census Variable Era Gap Tool",
    description:
      "Compare supplied census edition and definition identifiers, without inferring comparability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEdition: { type: "integer" },
        secondEdition: { type: "integer" },
        firstDefinition: { type: "string", maxLength: 8192 },
        secondDefinition: { type: "string", maxLength: 8192 },
      },
      required: [
        "firstEdition",
        "secondEdition",
        "firstDefinition",
        "secondDefinition",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        editionGapDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        definitionChanged: { type: "boolean" },
      },
      required: ["editionGapDecimal", "definitionChanged"],
    },
    ports: {
      inputs: [
        {
          id: "firstEdition",
          label: "First Edition",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondEdition",
          label: "Second Edition",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstDefinition",
          label: "First Definition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondDefinition",
          label: "Second Definition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "editionGapDecimal",
          label: "Edition Gap Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "definitionChanged",
          label: "Definition Changed",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = censusVariableEraGapTool.execute;
export default censusVariableEraGapTool;
