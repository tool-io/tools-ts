import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly target: number;
  readonly onHand: number;
  readonly onOrder: number;
  readonly reserved: number;
  readonly packSize: number;
};
export type Output = {
  readonly netPosition: number;
  readonly required: number;
  readonly packs: number;
  readonly orderedUnits: number;
  readonly excess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    target: { type: "integer", minimum: 0 },
    onHand: { type: "integer", minimum: 0 },
    onOrder: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
    packSize: { type: "integer", minimum: 1 },
  },
  required: ["target", "onHand", "onOrder", "reserved", "packSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netPosition: { type: "integer" },
    required: { type: "integer" },
    packs: { type: "integer" },
    orderedUnits: { type: "integer" },
    excess: { type: "integer" },
  },
  required: ["netPosition", "required", "packs", "orderedUnits", "excess"],
} as const;
/** Calculate ward stock imprest reorder pack rounding from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { target, onHand, onOrder, reserved, packSize } = request;
  const compute = (): Output => {
    H.integer(target, 0);
    H.integer(onHand, 0);
    H.integer(onOrder, 0);
    H.integer(reserved, 0);
    H.integer(packSize, 1);
    return {
      netPosition: onHand + onOrder - reserved,
      required: Math.max(0, target - onHand - onOrder + reserved),
      packs: Math.ceil(
        Math.max(0, target - onHand - onOrder + reserved) / packSize,
      ),
      orderedUnits:
        Math.ceil(
          Math.max(0, target - onHand - onOrder + reserved) / packSize,
        ) * packSize,
      excess:
        Math.ceil(
          Math.max(0, target - onHand - onOrder + reserved) / packSize,
        ) *
          packSize -
        Math.max(0, target - onHand - onOrder + reserved),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { target: 100, onHand: 45, onOrder: 10, reserved: 5, packSize: 12 },
  output: {
    netPosition: 50,
    required: 50,
    packs: 5,
    orderedUnits: 60,
    excess: 10,
  },
} satisfies ToolExample<Input, Output>;
export const wardStockImprestReorderPackRoundingTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hospital-pharmacy/ward-stock-imprest-reorder-pack-rounding",
      title: "Ward Stock Imprest Reorder Pack Rounding Tool",
      description:
        "Calculate ward stock imprest reorder pack rounding from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          target: { type: "integer", minimum: 0 },
          onHand: { type: "integer", minimum: 0 },
          onOrder: { type: "integer", minimum: 0 },
          reserved: { type: "integer", minimum: 0 },
          packSize: { type: "integer", minimum: 1 },
        },
        required: ["target", "onHand", "onOrder", "reserved", "packSize"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netPosition: { type: "integer" },
          required: { type: "integer" },
          packs: { type: "integer" },
          orderedUnits: { type: "integer" },
          excess: { type: "integer" },
        },
        required: [
          "netPosition",
          "required",
          "packs",
          "orderedUnits",
          "excess",
        ],
      },
      ports: {
        inputs: [
          {
            id: "target",
            label: "Target",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "onHand",
            label: "On Hand",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "onOrder",
            label: "On Order",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reserved",
            label: "Reserved",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "packSize",
            label: "Pack Size",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "netPosition",
            label: "Net Position",
            valueType: { type: "integer" },
          },
          { id: "required", label: "Required", valueType: { type: "integer" } },
          { id: "packs", label: "Packs", valueType: { type: "integer" } },
          {
            id: "orderedUnits",
            label: "Ordered Units",
            valueType: { type: "integer" },
          },
          { id: "excess", label: "Excess", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = wardStockImprestReorderPackRoundingTool.execute;
export default wardStockImprestReorderPackRoundingTool;
