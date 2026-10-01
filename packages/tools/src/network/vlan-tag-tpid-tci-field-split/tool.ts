import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly bytes: readonly number[] };
export type Output = {
  readonly tpid: number;
  readonly priority: number;
  readonly dropEligible: boolean;
  readonly vlanId: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["bytes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tpid: { type: "integer" },
    priority: { type: "integer" },
    dropEligible: { type: "boolean" },
    vlanId: { type: "integer" },
  },
  required: ["tpid", "priority", "dropEligible", "vlanId"],
} as const;
/** Compute vlan tag tpid tci field split from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { bytes } = input;
  const compute = (): Output => {
    domain(bytes.length === 4 && bytes.every((x) => x >= 0 && x <= 255));
    const tci = bytes[2] * 256 + bytes[3];
    return {
      tpid: bytes[0] * 256 + bytes[1],
      priority: tci >> 13,
      dropEligible: !!(tci & 4096),
      vlanId: tci & 4095,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bytes: [129, 0, 176, 7] },
  output: { tpid: 33024, priority: 5, dropEligible: true, vlanId: 7 },
} satisfies ToolExample<Input, Output>;
export const vlanTagTpidTciFieldSplitTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/vlan-tag-tpid-tci-field-split",
  title: "Vlan Tag TPID TCI Field Split Tool",
  description:
    "Compute vlan tag tpid tci field split from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "bytes",
        label: "Bytes",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
    outputs: [
      { id: "tpid", label: "Tpid", valueType: { type: "integer" } },
      { id: "priority", label: "Priority", valueType: { type: "integer" } },
      {
        id: "dropEligible",
        label: "Drop Eligible",
        valueType: { type: "boolean" },
      },
      { id: "vlanId", label: "Vlan Id", valueType: { type: "integer" } },
    ],
  },
});
export const run = vlanTagTpidTciFieldSplitTool.execute;
export default vlanTagTpidTciFieldSplitTool;
