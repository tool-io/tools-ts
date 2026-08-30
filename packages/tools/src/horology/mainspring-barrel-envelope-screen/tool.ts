import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MainspringBarrelFitInput = {
  readonly availableBarrelHeightMillimeters: number;
  readonly barrelArborDiameterMillimeters: number;
  readonly barrelInnerDiameterMillimeters: number;
  readonly replacementSpringHeightMillimeters: number;
  readonly requiredSpringRadialEnvelopeMillimeters: number;
  readonly requiredRadialClearanceMillimeters: number;
};

export type MainspringBarrelFitOutput = {
  readonly availableRadialEnvelopeMillimeters: number;
  readonly fitsCallerDimensions: boolean;
  readonly heightClearanceMillimeters: number;
};

export const screenMainspringBarrelFit = (
  input: MainspringBarrelFitInput,
): MainspringBarrelFitOutput => {
  if (
    !Number.isFinite(input.barrelInnerDiameterMillimeters) ||
    input.barrelInnerDiameterMillimeters <= 0
  )
    simpleError(
      "barrelInnerDiameterMillimeters",
      "Barrel inner diameter must be finite and positive.",
      "barrel_inner_diameter_invalid",
    );
  if (
    !Number.isFinite(input.barrelArborDiameterMillimeters) ||
    input.barrelArborDiameterMillimeters < 0
  )
    simpleError(
      "barrelArborDiameterMillimeters",
      "Arbor diameter must be finite and nonnegative.",
      "arbor_diameter_invalid",
    );
  if (
    input.barrelArborDiameterMillimeters >= input.barrelInnerDiameterMillimeters
  )
    simpleError(
      "barrelArborDiameterMillimeters",
      "Arbor diameter must be below barrel inner diameter.",
      "arbor_not_inside_barrel",
    );
  if (
    !Number.isFinite(input.requiredRadialClearanceMillimeters) ||
    input.requiredRadialClearanceMillimeters < 0
  )
    simpleError(
      "requiredRadialClearanceMillimeters",
      "Radial clearance must be finite and nonnegative.",
      "radial_clearance_invalid",
    );
  if (
    !Number.isFinite(input.requiredSpringRadialEnvelopeMillimeters) ||
    input.requiredSpringRadialEnvelopeMillimeters <= 0
  )
    simpleError(
      "requiredSpringRadialEnvelopeMillimeters",
      "Required radial envelope must be finite and positive.",
      "spring_radial_envelope_invalid",
    );
  if (
    !Number.isFinite(input.availableBarrelHeightMillimeters) ||
    input.availableBarrelHeightMillimeters <= 0
  )
    simpleError(
      "availableBarrelHeightMillimeters",
      "Available barrel height must be finite and positive.",
      "barrel_height_invalid",
    );
  if (
    !Number.isFinite(input.replacementSpringHeightMillimeters) ||
    input.replacementSpringHeightMillimeters <= 0
  )
    simpleError(
      "replacementSpringHeightMillimeters",
      "Spring height must be finite and positive.",
      "spring_height_invalid",
    );
  const availableRadialEnvelopeMillimeters =
    (input.barrelInnerDiameterMillimeters -
      input.barrelArborDiameterMillimeters) /
      2 -
    input.requiredRadialClearanceMillimeters;
  const heightClearanceMillimeters =
    input.availableBarrelHeightMillimeters -
    input.replacementSpringHeightMillimeters;
  return {
    availableRadialEnvelopeMillimeters,
    fitsCallerDimensions:
      availableRadialEnvelopeMillimeters >=
        input.requiredSpringRadialEnvelopeMillimeters &&
      heightClearanceMillimeters >= 0,
    heightClearanceMillimeters,
  };
};

export const mainspringBarrelFitExample = {
  input: {
    availableBarrelHeightMillimeters: 2,
    barrelArborDiameterMillimeters: 2,
    barrelInnerDiameterMillimeters: 12,
    replacementSpringHeightMillimeters: 1.5,
    requiredSpringRadialEnvelopeMillimeters: 1.2,
    requiredRadialClearanceMillimeters: 0.2,
  },
  output: {
    availableRadialEnvelopeMillimeters: 4.8,
    fitsCallerDimensions: true,
    heightClearanceMillimeters: 0.5,
  },
} satisfies ToolExample<MainspringBarrelFitInput, MainspringBarrelFitOutput>;

export const mainspringBarrelFitTool = createSimpleTool({
  calculate: (input) =>
    screenMainspringBarrelFit({
      availableBarrelHeightMillimeters:
        input.availableBarrelHeightMillimeters as number,
      barrelArborDiameterMillimeters:
        input.barrelArborDiameterMillimeters as number,
      barrelInnerDiameterMillimeters:
        input.barrelInnerDiameterMillimeters as number,
      replacementSpringHeightMillimeters:
        input.replacementSpringHeightMillimeters as number,
      requiredSpringRadialEnvelopeMillimeters:
        input.requiredSpringRadialEnvelopeMillimeters as number,
      requiredRadialClearanceMillimeters:
        input.requiredRadialClearanceMillimeters as number,
    }),
  description:
    "Screen a caller-supplied mainspring radial envelope and height against barrel, arbor, and clearance dimensions without deriving the envelope from spring length, thickness, or strength.",
  id: "horology/mainspring-barrel-envelope-screen",
  inputs: [
    {
      id: "availableBarrelHeightMillimeters",
      kind: "number",
      label: "Available barrel height",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "barrelArborDiameterMillimeters",
      kind: "number",
      label: "Barrel arbor diameter",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "barrelInnerDiameterMillimeters",
      kind: "number",
      label: "Barrel inner diameter",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "replacementSpringHeightMillimeters",
      kind: "number",
      label: "Replacement spring height",
      minimum: 0,
      unit: "mm",
    },
    {
      description:
        "Caller-determined radial envelope required by the spring in the assessed winding state.",
      id: "requiredSpringRadialEnvelopeMillimeters",
      kind: "number",
      label: "Required spring radial envelope",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "requiredRadialClearanceMillimeters",
      kind: "number",
      label: "Required radial clearance",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "availableRadialEnvelopeMillimeters",
      kind: "number",
      label: "Available radial envelope",
      unit: "mm",
    },
    {
      id: "fitsCallerDimensions",
      kind: "boolean",
      label: "Fits caller dimensions",
    },
    {
      id: "heightClearanceMillimeters",
      kind: "number",
      label: "Height clearance",
      unit: "mm",
    },
  ],
  title: "Mainspring Barrel Envelope Screen",
});

export const runMainspringBarrelFit = mainspringBarrelFitTool.execute;
export default mainspringBarrelFitTool;
