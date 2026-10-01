import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly methodFields: readonly string[];
  readonly suppliedSourceIds: readonly string[];
  readonly verifiableSourceIds: readonly string[];
};
export type Output = {
  readonly methodFieldsCount: number;
  readonly missingSourceFields: number;
  readonly unverifiedSourceFields: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    methodFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedSourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    verifiableSourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["methodFields", "suppliedSourceIds", "verifiableSourceIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    methodFieldsCount: { type: "integer" },
    missingSourceFields: { type: "integer" },
    unverifiedSourceFields: { type: "integer" },
  },
  required: [
    "methodFieldsCount",
    "missingSourceFields",
    "unverifiedSourceFields",
  ],
} as const;
/** Calculate research method source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { methodFields, suppliedSourceIds, verifiableSourceIds } = request;
  const compute = (): Output => {
    H.sameLength(methodFields, suppliedSourceIds);
    H.domain(new Set(methodFields).size === methodFields.length);
    return {
      methodFieldsCount: methodFields.length,
      missingSourceFields: suppliedSourceIds.filter((x) => x.length === 0)
        .length,
      unverifiedSourceFields: suppliedSourceIds.filter(
        (x) => x.length > 0 && !verifiableSourceIds.includes(x),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    methodFields: ["design", "comparator"],
    suppliedSourceIds: ["s1", "s2"],
    verifiableSourceIds: ["s1"],
  },
  output: {
    methodFieldsCount: 2,
    missingSourceFields: 0,
    unverifiedSourceFields: 1,
  },
} satisfies ToolExample<Input, Output>;
export const researchMethodSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/research-method-source-gap",
    title: "Research Method Source Gap Tool",
    description:
      "Calculate research method source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        methodFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedSourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        verifiableSourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["methodFields", "suppliedSourceIds", "verifiableSourceIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        methodFieldsCount: { type: "integer" },
        missingSourceFields: { type: "integer" },
        unverifiedSourceFields: { type: "integer" },
      },
      required: [
        "methodFieldsCount",
        "missingSourceFields",
        "unverifiedSourceFields",
      ],
    },
    ports: {
      inputs: [
        {
          id: "methodFields",
          label: "Method Fields",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedSourceIds",
          label: "Supplied Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "verifiableSourceIds",
          label: "Verifiable Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "methodFieldsCount",
          label: "Method Fields Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingSourceFields",
          label: "Missing Source Fields",
          valueType: { type: "integer" },
        },
        {
          id: "unverifiedSourceFields",
          label: "Unverified Source Fields",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchMethodSourceGapTool.execute;
export default researchMethodSourceGapTool;
