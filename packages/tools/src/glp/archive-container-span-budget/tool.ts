import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSlot: number;
  readonly lastSlot: number;
  readonly unavailable: readonly number[];
};
export type Output = {
  readonly nominalSlots: number;
  readonly availableSlots: number;
  readonly duplicateAnnotations: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSlot: { type: "integer", minimum: 0 },
    lastSlot: { type: "integer" },
    unavailable: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["firstSlot", "lastSlot", "unavailable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalSlots: { type: "integer" },
    availableSlots: { type: "integer" },
    duplicateAnnotations: { type: "integer" },
  },
  required: ["nominalSlots", "availableSlots", "duplicateAnnotations"],
} as const;
/** Calculate archive container span budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSlot, lastSlot, unavailable } = request;
  const compute = (): Output => {
    H.integer(firstSlot, 0);
    H.integer(lastSlot, firstSlot);
    H.domain(unavailable.every((x) => x >= firstSlot && x <= lastSlot));
    return {
      nominalSlots: lastSlot - firstSlot + 1,
      availableSlots: lastSlot - firstSlot + 1 - new Set(unavailable).size,
      duplicateAnnotations: unavailable.length - new Set(unavailable).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstSlot: 10, lastSlot: 20, unavailable: [12, 15, 15] },
  output: { nominalSlots: 11, availableSlots: 9, duplicateAnnotations: 1 },
} satisfies ToolExample<Input, Output>;
export const archiveContainerSpanBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/archive-container-span-budget",
    title: "Archive Container Span Budget Tool",
    description:
      "Calculate archive container span budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSlot: { type: "integer", minimum: 0 },
        lastSlot: { type: "integer" },
        unavailable: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["firstSlot", "lastSlot", "unavailable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalSlots: { type: "integer" },
        availableSlots: { type: "integer" },
        duplicateAnnotations: { type: "integer" },
      },
      required: ["nominalSlots", "availableSlots", "duplicateAnnotations"],
    },
    ports: {
      inputs: [
        {
          id: "firstSlot",
          label: "First Slot",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastSlot",
          label: "Last Slot",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unavailable",
          label: "Unavailable",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "nominalSlots",
          label: "Nominal Slots",
          valueType: { type: "integer" },
        },
        {
          id: "availableSlots",
          label: "Available Slots",
          valueType: { type: "integer" },
        },
        {
          id: "duplicateAnnotations",
          label: "Duplicate Annotations",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = archiveContainerSpanBudgetTool.execute;
export default archiveContainerSpanBudgetTool;
