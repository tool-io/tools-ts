import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly universe: readonly string[];
  readonly covered: readonly string[];
};
export type Output = {
  readonly missing: readonly string[];
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universe: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    covered: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["universe", "covered"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missing: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    gap: { type: "integer" },
  },
  required: ["missing", "gap"],
} as const;
/** Calculate finite set prefix cover count gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { universe, covered } = request;
  const compute = (): Output => {
    const c = new Set(covered),
      missing = [...new Set(universe)].filter((x) => !c.has(x));
    return { missing, gap: missing.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { universe: ["a", "b", "c"], covered: ["a", "c"] },
  output: { missing: ["b"], gap: 1 },
} satisfies ToolExample<Input, Output>;
export const finiteSetPrefixCoverCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/finite-set-prefix-cover-count-gap",
    title: "Finite Set Prefix Cover Count Gap Tool",
    description:
      "Calculate finite set prefix cover count gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        universe: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        covered: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["universe", "covered"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missing: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        gap: { type: "integer" },
      },
      required: ["missing", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "universe",
          label: "Universe",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "covered",
          label: "Covered",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missing",
          label: "Missing",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = finiteSetPrefixCoverCountGapTool.execute;
export default finiteSetPrefixCoverCountGapTool;
