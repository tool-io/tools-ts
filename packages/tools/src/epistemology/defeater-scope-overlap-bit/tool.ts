import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimScopes: readonly string[];
  readonly defeaterScopes: readonly string[];
  readonly defeaterActive: boolean;
};
export type Output = {
  readonly scopeOverlap: boolean;
  readonly appliesUnderFlags: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimScopes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    defeaterScopes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    defeaterActive: { type: "boolean" },
  },
  required: ["claimScopes", "defeaterScopes", "defeaterActive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scopeOverlap: { type: "boolean" },
    appliesUnderFlags: { type: "boolean" },
  },
  required: ["scopeOverlap", "appliesUnderFlags"],
} as const;
/** Calculate defeater scope overlap bit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimScopes, defeaterScopes, defeaterActive } = request;
  const compute = (): Output => {
    return {
      scopeOverlap: claimScopes.some((x) => defeaterScopes.includes(x)),
      appliesUnderFlags:
        defeaterActive && claimScopes.some((x) => defeaterScopes.includes(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claimScopes: ["a", "b"],
    defeaterScopes: ["b"],
    defeaterActive: true,
  },
  output: { scopeOverlap: true, appliesUnderFlags: true },
} satisfies ToolExample<Input, Output>;
export const defeaterScopeOverlapBitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/defeater-scope-overlap-bit",
    title: "Defeater Scope Overlap Bit Tool",
    description:
      "Calculate defeater scope overlap bit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimScopes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        defeaterScopes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        defeaterActive: { type: "boolean" },
      },
      required: ["claimScopes", "defeaterScopes", "defeaterActive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scopeOverlap: { type: "boolean" },
        appliesUnderFlags: { type: "boolean" },
      },
      required: ["scopeOverlap", "appliesUnderFlags"],
    },
    ports: {
      inputs: [
        {
          id: "claimScopes",
          label: "Claim Scopes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "defeaterScopes",
          label: "Defeater Scopes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "defeaterActive",
          label: "Defeater Active",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "scopeOverlap",
          label: "Scope Overlap",
          valueType: { type: "boolean" },
        },
        {
          id: "appliesUnderFlags",
          label: "Applies Under Flags",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = defeaterScopeOverlapBitTool.execute;
export default defeaterScopeOverlapBitTool;
