import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const palletFaces = {
  impulse: {
    caution:
      "Impulse-face angle and length are design-specific and must be measured on the actual escapement.",
    objective:
      "Transfer escape-wheel energy to the lever and balance during the impulse phase.",
    role: "Impulse face",
  },
  locking: {
    caution:
      "Locking geometry controls safety, drop, draw, and banking; it is not a universal fixed angle.",
    objective:
      "Hold the escape wheel until the lever and balance unlock the next tooth.",
    role: "Locking face",
  },
} as const;

export type PalletFace = keyof typeof palletFaces;

export type PalletFaceInput = {
  readonly palletFace: PalletFace;
};

export type PalletFaceOutput = {
  readonly objective: string;
  readonly palletFace: PalletFace;
  readonly role: string;
  readonly specificationCaution: string;
};

export const lookupLeverPalletFaceRole = (
  input: PalletFaceInput,
): PalletFaceOutput => {
  const entry = palletFaces[input.palletFace];
  if (entry === undefined)
    simpleError(
      "palletFace",
      "Pallet face is not supported.",
      "unsupported_pallet_face",
    );
  return {
    objective: entry.objective,
    palletFace: input.palletFace,
    role: entry.role,
    specificationCaution: entry.caution,
  };
};

export const palletFaceExample = {
  input: { palletFace: "locking" },
  output: {
    objective:
      "Hold the escape wheel until the lever and balance unlock the next tooth.",
    palletFace: "locking",
    role: "Locking face",
    specificationCaution:
      "Locking geometry controls safety, drop, draw, and banking; it is not a universal fixed angle.",
  },
} satisfies ToolExample<PalletFaceInput, PalletFaceOutput>;

export const palletFaceTool = createSimpleTool({
  calculate: (input) =>
    lookupLeverPalletFaceRole({ palletFace: input.palletFace as PalletFace }),
  description:
    "Return the mechanical role and adjustment caution for a Swiss lever pallet's locking or impulse face without inventing universal angles.",
  id: "horology/lever-escapement-pallet-face-roles-lookup",
  inputs: [
    {
      enum: ["locking", "impulse"],
      id: "palletFace",
      kind: "string",
      label: "Lever pallet face",
    },
  ],
  outputs: [
    { id: "objective", kind: "string", label: "Face objective" },
    { id: "palletFace", kind: "string", label: "Lever pallet face" },
    { id: "role", kind: "string", label: "Face role" },
    {
      id: "specificationCaution",
      kind: "string",
      label: "Specification caution",
    },
  ],
  title: "Lever Escapement Pallet Face Roles Lookup",
});

export const runPalletFace = palletFaceTool.execute;
export default palletFaceTool;
