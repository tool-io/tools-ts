import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly identifiers: readonly string[] };
export type Output = {
  readonly leadingZeroCounts: readonly number[];
  readonly numericCollisionGroups: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifiers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["identifiers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadingZeroCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    numericCollisionGroups: { type: "integer" },
  },
  required: ["leadingZeroCounts", "numericCollisionGroups"],
} as const;
/** Inspect digit-only field identifiers without coercing large identifiers to floating-point numbers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifiers } = request;
  const compute = (): Output => {
    H.domain(identifiers.every((x) => /^\d+(?![\s\S])/.test(x)));
    const normalized = identifiers.map((x) => x.replace(/^0+(?=\d)/, "")),
      counts = new Map<string, Set<string>>();
    identifiers.forEach((x, i) => {
      const s = counts.get(normalized[i]) ?? new Set<string>();
      s.add(x);
      counts.set(normalized[i], s);
    });
    return {
      leadingZeroCounts: identifiers.map(
        (x, i) => x.length - normalized[i].length,
      ),
      numericCollisionGroups: [...counts.values()].filter((x) => x.size > 1)
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifiers: ["001", "1", "002"] },
  output: { leadingZeroCounts: [2, 0, 2], numericCollisionGroups: 1 },
} satisfies ToolExample<Input, Output>;
export const fieldIdLeadingZeroBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/field-id-leading-zero-budget",
    title: "Field ID Leading Zero Budget Tool",
    description:
      "Inspect digit-only field identifiers without coercing large identifiers to floating-point numbers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identifiers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["identifiers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadingZeroCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        numericCollisionGroups: { type: "integer" },
      },
      required: ["leadingZeroCounts", "numericCollisionGroups"],
    },
    ports: {
      inputs: [
        {
          id: "identifiers",
          label: "Identifiers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "leadingZeroCounts",
          label: "Leading Zero Counts",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "numericCollisionGroups",
          label: "Numeric Collision Groups",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = fieldIdLeadingZeroBudgetTool.execute;
export default fieldIdLeadingZeroBudgetTool;
