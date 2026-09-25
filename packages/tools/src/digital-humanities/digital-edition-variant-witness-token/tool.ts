import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly witnesses: readonly string[];
  readonly declared: readonly string[];
};
export type Output = {
  readonly unknown: readonly string[];
  readonly uniqueWitnesses: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    witnesses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    declared: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["witnesses", "declared"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unknown: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    uniqueWitnesses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["unknown", "uniqueWitnesses"],
} as const;
/** Audit exact local-fragment witness references against explicit declared IDs; no external resolution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { witnesses, declared } = request;
  const compute = (): Output => {
    H.domain(
      declared.every((x) => x.length > 0) &&
        witnesses.every((x) => x.startsWith("#") && x.length > 1),
    );
    const uniqueWitnesses = [...new Set(witnesses)],
      known = new Set(declared);
    return {
      unknown: uniqueWitnesses.filter((x) => !known.has(x.slice(1))),
      uniqueWitnesses,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { witnesses: ["#A", "#B", "#A"], declared: ["A"] },
  output: { unknown: ["#B"], uniqueWitnesses: ["#A", "#B"] },
} satisfies ToolExample<Input, Output>;
export const digitalEditionVariantWitnessTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/digital-edition-variant-witness-token",
    title: "Digital Edition Variant Witness Token Tool",
    description:
      "Audit exact local-fragment witness references against explicit declared IDs; no external resolution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        witnesses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        declared: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["witnesses", "declared"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unknown: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        uniqueWitnesses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["unknown", "uniqueWitnesses"],
    },
    ports: {
      inputs: [
        {
          id: "witnesses",
          label: "Witnesses",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "declared",
          label: "Declared",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "unknown",
          label: "Unknown",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "uniqueWitnesses",
          label: "Unique Witnesses",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = digitalEditionVariantWitnessTokenTool.execute;
export default digitalEditionVariantWitnessTokenTool;
