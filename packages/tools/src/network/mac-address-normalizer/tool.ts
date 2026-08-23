import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MacAddressNormalizerInput = { readonly macAddress: string };
export type MacAddressNormalizerOutput = { readonly normalized: string };

export const calculateMacAddressNormalizer = (
  input: MacAddressNormalizerInput,
): MacAddressNormalizerOutput => {
  const cleaned = input.macAddress.replace(/[.\s:-]/gu, "").toLowerCase();
  if (!/^[0-9a-f]{12}$/u.test(cleaned))
    simpleError(
      "macAddress",
      "Enter a valid 48-bit MAC address.",
      "invalid_mac_address",
    );
  return { normalized: cleaned.match(/.{2}/gu)!.join(":") };
};

export const macAddressNormalizerExample = {
  input: { macAddress: "00-1A-2B-3C-4D-5E" },
  output: { normalized: "00:1a:2b:3c:4d:5e" },
} satisfies ToolExample<MacAddressNormalizerInput, MacAddressNormalizerOutput>;

export const macAddressNormalizerTool = createSimpleTool({
  calculate: (input) =>
    calculateMacAddressNormalizer(input as MacAddressNormalizerInput),
  description: "Normalize a 48-bit MAC address to lowercase colon notation.",
  id: "network/mac-address-normalizer",
  inputs: [{ id: "macAddress", kind: "string", label: "MAC address" }],
  outputs: [{ id: "normalized", kind: "string", label: "Normalized MAC" }],
  title: "MAC Address Normalizer",
});

export const runMacAddressNormalizer = macAddressNormalizerTool.execute;
export default macAddressNormalizerTool;
