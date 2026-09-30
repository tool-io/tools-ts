import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly item: number;
  readonly first: number;
  readonly last: number;
  readonly includeLast: boolean;
};
export type Output = {
  readonly inRange: boolean;
  readonly relativeIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    item: { type: "integer" },
    first: { type: "integer" },
    last: { type: "integer" },
    includeLast: { type: "boolean" },
  },
  required: ["item", "first", "last", "includeLast"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inRange: { type: "boolean" },
    relativeIndex: { type: "integer" },
  },
  required: ["inRange", "relativeIndex"],
} as const;
/** Evaluate a supplied archival item range under an explicit final-item convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { item, first, last, includeLast } = request;
  const compute = (): Output => {
    H.domain(last >= first);
    return {
      inRange: item >= first && (includeLast ? item <= last : item < last),
      relativeIndex: item - first,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { item: 20, first: 10, last: 20, includeLast: true },
  output: { inRange: true, relativeIndex: 10 },
} satisfies ToolExample<Input, Output>;
export const archiveLegajoItemRangeBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "latin-american-studies/archive-legajo-item-range-boundary",
    title: "Archive Legajo Item Range Boundary Tool",
    description:
      "Evaluate a supplied archival item range under an explicit final-item convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        item: { type: "integer" },
        first: { type: "integer" },
        last: { type: "integer" },
        includeLast: { type: "boolean" },
      },
      required: ["item", "first", "last", "includeLast"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inRange: { type: "boolean" },
        relativeIndex: { type: "integer" },
      },
      required: ["inRange", "relativeIndex"],
    },
    ports: {
      inputs: [
        {
          id: "item",
          label: "Item",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "last",
          label: "Last",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeLast",
          label: "Include Last",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inRange", label: "In Range", valueType: { type: "boolean" } },
        {
          id: "relativeIndex",
          label: "Relative Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = archiveLegajoItemRangeBoundaryTool.execute;
export default archiveLegajoItemRangeBoundaryTool;
