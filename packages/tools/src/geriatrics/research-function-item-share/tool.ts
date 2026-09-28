import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly available: readonly boolean[];
  readonly inDomain: readonly boolean[];
};
export type Output = {
  readonly domainItems: number;
  readonly availableDomainItems: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "array", maxItems: 256, items: { type: "boolean" } },
    inDomain: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["available", "inDomain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domainItems: { type: "integer" },
    availableDomainItems: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["domainItems", "availableDomainItems", "share", "defined"],
} as const;
/** Audit supplied research-item availability without generating a functional clinical score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { available, inDomain } = request;
  const compute = (): Output => {
    H.sameLength(available, inDomain);
    return {
      domainItems: inDomain.filter(Boolean).length,
      availableDomainItems: available.filter((x, i) => x && inDomain[i]).length,
      share: inDomain.some(Boolean)
        ? available.filter((x, i) => x && inDomain[i]).length /
          inDomain.filter(Boolean).length
        : 0,
      defined: inDomain.some(Boolean),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { available: [true, false, true], inDomain: [true, true, false] },
  output: {
    domainItems: 2,
    availableDomainItems: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const researchFunctionItemShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/research-function-item-share",
    title: "Research Function Item Share Tool",
    description:
      "Audit supplied research-item availability without generating a functional clinical score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        available: { type: "array", maxItems: 256, items: { type: "boolean" } },
        inDomain: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["available", "inDomain"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        domainItems: { type: "integer" },
        availableDomainItems: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["domainItems", "availableDomainItems", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "available",
          label: "Available",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "inDomain",
          label: "In Domain",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "domainItems",
          label: "Domain Items",
          valueType: { type: "integer" },
        },
        {
          id: "availableDomainItems",
          label: "Available Domain Items",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchFunctionItemShareTool.execute;
export default researchFunctionItemShareTool;
