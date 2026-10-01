import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly address: number;
  readonly parentPrefix: number;
  readonly childPrefix: number;
};
export type Output = {
  readonly childIndex: number;
  readonly parentNetwork: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    address: { type: "integer", minimum: 0, maximum: 4294967295 },
    parentPrefix: { type: "integer", minimum: 0, maximum: 32 },
    childPrefix: { type: "integer", maximum: 32 },
  },
  required: ["address", "parentPrefix", "childPrefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    childIndex: { type: "integer" },
    parentNetwork: { type: "integer" },
  },
  required: ["childIndex", "parentNetwork"],
} as const;
/** Calculate network prefix child index from address from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { address, parentPrefix, childPrefix } = request;
  const compute = (): Output => {
    H.integer(address, 0, 4294967295);
    H.integer(parentPrefix, 0, 32);
    H.integer(childPrefix, parentPrefix, 32);
    const hostBits = 32 - parentPrefix,
      childHost = 32 - childPrefix,
      parentNetwork = Math.floor(address / 2 ** hostBits) * 2 ** hostBits;
    return {
      childIndex: Math.floor((address - parentNetwork) / 2 ** childHost),
      parentNetwork,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { address: 3232235936, parentPrefix: 24, childPrefix: 26 },
  output: { childIndex: 2, parentNetwork: 3232235776 },
} satisfies ToolExample<Input, Output>;
export const networkPrefixChildIndexFromAddressTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/network-prefix-child-index-from-address",
    title: "Network Prefix Child Index From Address Tool",
    description:
      "Calculate network prefix child index from address from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        address: { type: "integer", minimum: 0, maximum: 4294967295 },
        parentPrefix: { type: "integer", minimum: 0, maximum: 32 },
        childPrefix: { type: "integer", maximum: 32 },
      },
      required: ["address", "parentPrefix", "childPrefix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        childIndex: { type: "integer" },
        parentNetwork: { type: "integer" },
      },
      required: ["childIndex", "parentNetwork"],
    },
    ports: {
      inputs: [
        {
          id: "address",
          label: "Address",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "parentPrefix",
          label: "Parent Prefix",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "childPrefix",
          label: "Child Prefix",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "childIndex",
          label: "Child Index",
          valueType: { type: "integer" },
        },
        {
          id: "parentNetwork",
          label: "Parent Network",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = networkPrefixChildIndexFromAddressTool.execute;
export default networkPrefixChildIndexFromAddressTool;
