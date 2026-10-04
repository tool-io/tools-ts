import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstOctet: number };
export type Output = {
  readonly multicast: boolean;
  readonly locallyAdministered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { firstOctet: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["firstOctet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multicast: { type: "boolean" },
    locallyAdministered: { type: "boolean" },
  },
  required: ["multicast", "locallyAdministered"],
} as const;
/** Calculate mac eui local multicast bit check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOctet } = request;
  const compute = (): Output => {
    H.integer(firstOctet, 0, 255);
    return {
      multicast: (firstOctet & 1) !== 0,
      locallyAdministered: (firstOctet & 2) !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstOctet: 3 },
  output: { multicast: true, locallyAdministered: true },
} satisfies ToolExample<Input, Output>;
export const macEuiLocalMulticastBitCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/mac-eui-local-multicast-bit-check",
    title: "Mac Eui Local Multicast Bit Check Tool",
    description:
      "Calculate mac eui local multicast bit check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { firstOctet: { type: "integer", minimum: 0, maximum: 255 } },
      required: ["firstOctet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        multicast: { type: "boolean" },
        locallyAdministered: { type: "boolean" },
      },
      required: ["multicast", "locallyAdministered"],
    },
    ports: {
      inputs: [
        {
          id: "firstOctet",
          label: "First Octet",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "multicast", label: "Multicast", valueType: { type: "boolean" } },
        {
          id: "locallyAdministered",
          label: "Locally Administered",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = macEuiLocalMulticastBitCheckTool.execute;
export default macEuiLocalMulticastBitCheckTool;
