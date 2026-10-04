import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly address: string; readonly port: number };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    address: { type: "string", maxLength: 8192 },
    port: { type: "integer", minimum: 1, maximum: 65535 },
  },
  required: ["address", "port"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Quote an already supplied IPv6 address token and explicit port in a Forwarded for parameter; this is not a complete IPv6 validator. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { address, port } = input;
  const compute = (): Output => {
    H.domain(/^[0-9A-Fa-f:]+(?![\s\S])/.test(address) && address.includes(":"));
    H.integer(port, 1, 65535);
    return { token: "for=\x22[" + address + "]:" + port + "\x22" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { address: "2001:db8::1", port: 443 },
  output: { token: 'for="[2001:db8::1]:443"' },
} satisfies ToolExample<Input, Output>;
export const httpForwardedQuotedAddressTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/http-forwarded-quoted-address-token",
    title: "HTTP Forwarded Quoted Address Token Tool",
    description:
      "Quote an already supplied IPv6 address token and explicit port in a Forwarded for parameter; this is not a complete IPv6 validator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        address: { type: "string", maxLength: 8192 },
        port: { type: "integer", minimum: 1, maximum: 65535 },
      },
      required: ["address", "port"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "address",
          label: "Address",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "port",
          label: "Port",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = httpForwardedQuotedAddressTokenTool.execute;
export default httpForwardedQuotedAddressTokenTool;
