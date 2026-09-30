import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shelfmark: string;
  readonly delimiter: string;
  readonly componentIndex: number;
};
export type Output = {
  readonly component: string;
  readonly componentCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shelfmark: { type: "string", maxLength: 8192 },
    delimiter: { type: "string", maxLength: 8192 },
    componentIndex: { type: "integer", minimum: 0 },
  },
  required: ["shelfmark", "delimiter", "componentIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    component: { type: "string", maxLength: 8192 },
    componentCount: { type: "integer" },
  },
  required: ["component", "componentCount"],
} as const;
/** Extract one supplied shelfmark component under an explicit delimiter convention, without imposing a catalog classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shelfmark, delimiter, componentIndex } = request;
  const compute = (): Output => {
    H.domain(delimiter.length > 0);
    const a = shelfmark.split(delimiter);
    H.integer(componentIndex, 0, a.length - 1);
    return { component: a[componentIndex], componentCount: a.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shelfmark: "QA/76/2024", delimiter: "/", componentIndex: 1 },
  output: { component: "76", componentCount: 3 },
} satisfies ToolExample<Input, Output>;
export const shelfmarkSortComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/shelfmark-sort-component",
    title: "Shelfmark Sort Component Tool",
    description:
      "Extract one supplied shelfmark component under an explicit delimiter convention, without imposing a catalog classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shelfmark: { type: "string", maxLength: 8192 },
        delimiter: { type: "string", maxLength: 8192 },
        componentIndex: { type: "integer", minimum: 0 },
      },
      required: ["shelfmark", "delimiter", "componentIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        component: { type: "string", maxLength: 8192 },
        componentCount: { type: "integer" },
      },
      required: ["component", "componentCount"],
    },
    ports: {
      inputs: [
        {
          id: "shelfmark",
          label: "Shelfmark",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "delimiter",
          label: "Delimiter",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "componentIndex",
          label: "Component Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "component", label: "Component", valueType: { type: "string" } },
        {
          id: "componentCount",
          label: "Component Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = shelfmarkSortComponentTool.execute;
export default shelfmarkSortComponentTool;
