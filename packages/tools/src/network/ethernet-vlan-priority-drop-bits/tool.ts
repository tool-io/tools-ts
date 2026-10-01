import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly tci: number };
export type Output = {
  readonly priority: number;
  readonly dropEligible: boolean;
  readonly vlanId: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tci: { type: "integer", minimum: 0, maximum: 65535 } },
  required: ["tci"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priority: { type: "integer" },
    dropEligible: { type: "boolean" },
    vlanId: { type: "integer" },
  },
  required: ["priority", "dropEligible", "vlanId"],
} as const;
/** Calculate ethernet vlan priority drop bits from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tci } = request;
  const compute = (): Output => {
    H.integer(tci, 0, 65535);
    return {
      priority: tci >>> 13,
      dropEligible: (tci & 4096) !== 0,
      vlanId: tci & 4095,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tci: 45156 },
  output: { priority: 5, dropEligible: true, vlanId: 100 },
} satisfies ToolExample<Input, Output>;
export const ethernetVlanPriorityDropBitsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/ethernet-vlan-priority-drop-bits",
    title: "Ethernet Vlan Priority Drop Bits Tool",
    description:
      "Calculate ethernet vlan priority drop bits from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tci: { type: "integer", minimum: 0, maximum: 65535 } },
      required: ["tci"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priority: { type: "integer" },
        dropEligible: { type: "boolean" },
        vlanId: { type: "integer" },
      },
      required: ["priority", "dropEligible", "vlanId"],
    },
    ports: {
      inputs: [
        {
          id: "tci",
          label: "Tci",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "priority", label: "Priority", valueType: { type: "integer" } },
        {
          id: "dropEligible",
          label: "Drop Eligible",
          valueType: { type: "boolean" },
        },
        { id: "vlanId", label: "Vlan Id", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = ethernetVlanPriorityDropBitsTool.execute;
export default ethernetVlanPriorityDropBitsTool;
