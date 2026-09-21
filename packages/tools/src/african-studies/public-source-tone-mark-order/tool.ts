import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly base: string;
  readonly marks: readonly string[];
  readonly suppliedOrder: readonly string[];
};
export type Output = {
  readonly orderedMarks: readonly string[];
  readonly display: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "string", maxLength: 8192 },
    marks: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["base", "marks", "suppliedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedMarks: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    display: { type: "string", maxLength: 8192 },
  },
  required: ["orderedMarks", "display"],
} as const;
/** Order supplied mark tokens according to an identified source convention; no orthography or Unicode canonical order is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { base, marks, suppliedOrder } = request;
  const compute = (): Output => {
    H.domain(
      new Set(suppliedOrder).size === suppliedOrder.length &&
        marks.every((x) => suppliedOrder.includes(x)),
    );
    const orderedMarks = [...marks].sort(
      (a, b) => suppliedOrder.indexOf(a) - suppliedOrder.indexOf(b),
    );
    return { orderedMarks, display: base + orderedMarks.join("") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    base: "a",
    marks: ["acute", "dot"],
    suppliedOrder: ["dot", "acute"],
  },
  output: { orderedMarks: ["dot", "acute"], display: "adotacute" },
} satisfies ToolExample<Input, Output>;
export const publicSourceToneMarkOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/public-source-tone-mark-order",
    title: "Public Source Tone Mark Order Tool",
    description:
      "Order supplied mark tokens according to an identified source convention; no orthography or Unicode canonical order is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "string", maxLength: 8192 },
        marks: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["base", "marks", "suppliedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedMarks: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        display: { type: "string", maxLength: 8192 },
      },
      required: ["orderedMarks", "display"],
    },
    ports: {
      inputs: [
        {
          id: "base",
          label: "Base",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "marks",
          label: "Marks",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedOrder",
          label: "Supplied Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "orderedMarks",
          label: "Ordered Marks",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "display", label: "Display", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = publicSourceToneMarkOrderTool.execute;
export default publicSourceToneMarkOrderTool;
