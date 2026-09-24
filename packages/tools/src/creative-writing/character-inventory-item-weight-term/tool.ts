import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemMass: number;
  readonly quantity: number;
  readonly containerTare: number;
};
export type Output = {
  readonly itemsMass: number;
  readonly carriedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemMass: { type: "number", minimum: 0 },
    quantity: { type: "integer", minimum: 0 },
    containerTare: { type: "number", minimum: 0 },
  },
  required: ["itemMass", "quantity", "containerTare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemsMass: { type: "number" },
    carriedMass: { type: "number" },
  },
  required: ["itemsMass", "carriedMass"],
} as const;
/** Calculate character inventory item weight term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemMass, quantity, containerTare } = request;
  const compute = (): Output => {
    H.domain(itemMass >= 0 && containerTare >= 0);
    H.integer(quantity, 0);
    return {
      itemsMass: itemMass * quantity,
      carriedMass: itemMass * quantity + containerTare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemMass: 0.5, quantity: 6, containerTare: 1 },
  output: { itemsMass: 3, carriedMass: 4 },
} satisfies ToolExample<Input, Output>;
export const characterInventoryItemWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/character-inventory-item-weight-term",
    title: "Character Inventory Item Weight Term Tool",
    description:
      "Calculate character inventory item weight term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemMass: { type: "number", minimum: 0 },
        quantity: { type: "integer", minimum: 0 },
        containerTare: { type: "number", minimum: 0 },
      },
      required: ["itemMass", "quantity", "containerTare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemsMass: { type: "number" },
        carriedMass: { type: "number" },
      },
      required: ["itemsMass", "carriedMass"],
    },
    ports: {
      inputs: [
        {
          id: "itemMass",
          label: "Item Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "containerTare",
          label: "Container Tare",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "itemsMass", label: "Items Mass", valueType: { type: "number" } },
        {
          id: "carriedMass",
          label: "Carried Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = characterInventoryItemWeightTermTool.execute;
export default characterInventoryItemWeightTermTool;
