import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly listedCount: number;
  readonly declaredCount: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    listedCount: { type: "integer", minimum: 0 },
    declaredCount: { type: "integer", minimum: 0 },
  },
  required: ["listedCount", "declaredCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" } },
  required: ["gap"],
} as const;
/** Calculate reference section count gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { listedCount, declaredCount } = request;
  const compute = (): Output => {
    H.integer(listedCount, 0);
    H.integer(declaredCount, 0);
    return { gap: listedCount - declaredCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { listedCount: 42, declaredCount: 40 },
  output: { gap: 2 },
} satisfies ToolExample<Input, Output>;
export const referenceSectionCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/reference-section-count-gap",
    title: "Reference Section Count Gap Tool",
    description:
      "Calculate reference section count gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        listedCount: { type: "integer", minimum: 0 },
        declaredCount: { type: "integer", minimum: 0 },
      },
      required: ["listedCount", "declaredCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "integer" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "listedCount",
          label: "Listed Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "declaredCount",
          label: "Declared Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = referenceSectionCountGapTool.execute;
export default referenceSectionCountGapTool;
