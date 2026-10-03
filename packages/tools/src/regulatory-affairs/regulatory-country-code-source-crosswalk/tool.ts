import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly code: string;
  readonly sourceCodes: readonly string[];
  readonly targetCodes: readonly string[];
  readonly sourceEdition: string;
};
export type Output = {
  readonly mapped: string;
  readonly found: boolean;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    sourceCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targetCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceEdition: { type: "string", maxLength: 8192 },
  },
  required: ["code", "sourceCodes", "targetCodes", "sourceEdition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mapped: { type: "string", maxLength: 8192 },
    found: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["mapped", "found", "key"],
} as const;
/** Apply an explicitly supplied country-code crosswalk without a built-in registry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code, sourceCodes, targetCodes, sourceEdition } = request;
  const compute = (): Output => {
    H.sameLength(sourceCodes, targetCodes);
    H.domain(
      new Set(sourceCodes).size === sourceCodes.length &&
        sourceEdition.length > 0,
    );
    const index = sourceCodes.indexOf(code);
    return {
      mapped: index < 0 ? "" : targetCodes[index],
      found: index >= 0,
      key: JSON.stringify([sourceEdition, code]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    code: "AA",
    sourceCodes: ["AA", "BB"],
    targetCodes: ["A1", "B1"],
    sourceEdition: "local-v1",
  },
  output: { mapped: "A1", found: true, key: '["local-v1","AA"]' },
} satisfies ToolExample<Input, Output>;
export const regulatoryCountryCodeSourceCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/regulatory-country-code-source-crosswalk",
      title: "Regulatory Country Code Source Crosswalk Tool",
      description:
        "Apply an explicitly supplied country-code crosswalk without a built-in registry.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          code: { type: "string", maxLength: 8192 },
          sourceCodes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          targetCodes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          sourceEdition: { type: "string", maxLength: 8192 },
        },
        required: ["code", "sourceCodes", "targetCodes", "sourceEdition"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mapped: { type: "string", maxLength: 8192 },
          found: { type: "boolean" },
          key: { type: "string", maxLength: 8192 },
        },
        required: ["mapped", "found", "key"],
      },
      ports: {
        inputs: [
          {
            id: "code",
            label: "Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceCodes",
            label: "Source Codes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "targetCodes",
            label: "Target Codes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "sourceEdition",
            label: "Source Edition",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "mapped", label: "Mapped", valueType: { type: "string" } },
          { id: "found", label: "Found", valueType: { type: "boolean" } },
          { id: "key", label: "Key", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = regulatoryCountryCodeSourceCrosswalkTool.execute;
export default regulatoryCountryCodeSourceCrosswalkTool;
