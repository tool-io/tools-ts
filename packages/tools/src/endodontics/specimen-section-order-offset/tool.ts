import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionId: string;
  readonly referenceId: string;
  readonly suppliedOrder: readonly string[];
};
export type Output = { readonly known: boolean; readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionId: { type: "string", maxLength: 8192 },
    referenceId: { type: "string", maxLength: 8192 },
    suppliedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["sectionId", "referenceId", "suppliedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { known: { type: "boolean" }, offset: { type: "integer" } },
  required: ["known", "offset"],
} as const;
/** Calculate specimen section order offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionId, referenceId, suppliedOrder } = request;
  const compute = (): Output => {
    H.domain(new Set(suppliedOrder).size === suppliedOrder.length);
    return {
      known:
        suppliedOrder.includes(sectionId) &&
        suppliedOrder.includes(referenceId),
      offset:
        suppliedOrder.includes(sectionId) && suppliedOrder.includes(referenceId)
          ? suppliedOrder.indexOf(sectionId) -
            suppliedOrder.indexOf(referenceId)
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sectionId: "C", referenceId: "A", suppliedOrder: ["A", "B", "C"] },
  output: { known: true, offset: 2 },
} satisfies ToolExample<Input, Output>;
export const specimenSectionOrderOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/specimen-section-order-offset",
    title: "Specimen Section Order Offset Tool",
    description:
      "Calculate specimen section order offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionId: { type: "string", maxLength: 8192 },
        referenceId: { type: "string", maxLength: 8192 },
        suppliedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["sectionId", "referenceId", "suppliedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { known: { type: "boolean" }, offset: { type: "integer" } },
      required: ["known", "offset"],
    },
    ports: {
      inputs: [
        {
          id: "sectionId",
          label: "Section Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceId",
          label: "Reference Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedOrder",
          label: "Supplied Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "known", label: "Known", valueType: { type: "boolean" } },
        { id: "offset", label: "Offset", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = specimenSectionOrderOffsetTool.execute;
export default specimenSectionOrderOffsetTool;
