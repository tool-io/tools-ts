import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MycorrhizalHostPairValidatorInput = {
  readonly associationConfirmed: boolean;
  readonly fungusGenus: string;
  readonly hostGenus: string;
};

export type MycorrhizalHostPairValidatorOutput = {
  readonly pairValidated: boolean;
  readonly pairingNote: string;
};

export const mycorrhizalHostPairValidatorExample = {
  input: {
    associationConfirmed: true,
    fungusGenus: "Amanita",
    hostGenus: "Pinus",
  },
  output: { pairValidated: true, pairingNote: "Amanita x Pinus" },
} satisfies ToolExample<
  MycorrhizalHostPairValidatorInput,
  MycorrhizalHostPairValidatorOutput
>;

export const mycorrhizalHostPairValidatorTool = createSimpleTool({
  id: "mycology/mycorrhizal-host-pair-validator",
  title: "Host Pair Validator",
  description:
    "Validate the structure of a fungus-host genus pair and record whether the association has been confirmed by the caller's evidence source.",
  inputs: [
    {
      id: "associationConfirmed",
      kind: "boolean",
      label: "Association confirmed",
    },
    { id: "fungusGenus", kind: "string", label: "Fungus genus" },
    { id: "hostGenus", kind: "string", label: "Host genus" },
  ],
  outputs: [
    { id: "pairValidated", kind: "boolean", label: "Pair validated" },
    { id: "pairingNote", kind: "string", label: "Pairing note" },
  ],
  calculate: (input) => {
    const fungusGenus = (input.fungusGenus as string).trim();
    const hostGenus = (input.hostGenus as string).trim();
    if (fungusGenus.length === 0)
      simpleError(
        "fungusGenus",
        "Fungus genus must not be empty.",
        "empty_genus",
      );
    if (hostGenus.length === 0)
      simpleError("hostGenus", "Host genus must not be empty.", "empty_genus");
    if (fungusGenus.toLowerCase() === hostGenus.toLowerCase())
      simpleError(
        "hostGenus",
        "Fungus and host genera must differ.",
        "self_pairing",
      );
    return {
      pairValidated: input.associationConfirmed as boolean,
      pairingNote: fungusGenus + " x " + hostGenus,
    };
  },
});
export const runMycorrhizalHostPairValidator =
  mycorrhizalHostPairValidatorTool.execute;
export default mycorrhizalHostPairValidatorTool;
