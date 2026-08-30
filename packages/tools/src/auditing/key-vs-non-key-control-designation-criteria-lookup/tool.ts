import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KeyControlDesignationInput = {
  readonly addressesSignificantRisk: boolean;
  readonly quantitativeEffect: number;
  readonly qualitativeRisk: boolean;
  readonly quantitativeLimit: number;
  readonly quantitativeThreshold: number;
};

export type KeyControlDesignationOutput = {
  readonly criteriaMet: ReadonlyArray<string>;
  readonly keyControl: boolean;
};

export const designateKeyControl = (
  input: KeyControlDesignationInput,
): KeyControlDesignationOutput => {
  for (const [field, value] of [
    ["quantitativeEffect", input.quantitativeEffect],
    ["quantitativeLimit", input.quantitativeLimit],
    ["quantitativeThreshold", input.quantitativeThreshold],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be a finite nonnegative value.`,
        "invalid_quantitative_value",
      );
  for (const field of ["addressesSignificantRisk", "qualitativeRisk"] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (input.quantitativeThreshold > input.quantitativeLimit)
    simpleError(
      "quantitativeThreshold",
      "The designation threshold cannot exceed the quantitative limit.",
      "invalid_quantitative_thresholds",
    );
  const criteriaMet: string[] = [];
  if (input.addressesSignificantRisk)
    criteriaMet.push("addresses_significant_risk");
  if (input.qualitativeRisk) criteriaMet.push("qualitative_risk");
  if (
    input.quantitativeThreshold <= input.quantitativeLimit &&
    input.quantitativeEffect >= input.quantitativeThreshold
  )
    criteriaMet.push("quantitative_threshold");
  return { criteriaMet, keyControl: criteriaMet.length > 0 };
};

export const keyControlDesignationExample = {
  input: {
    addressesSignificantRisk: true,
    quantitativeEffect: 20_000,
    qualitativeRisk: false,
    quantitativeLimit: 50_000,
    quantitativeThreshold: 10_000,
  },
  output: {
    criteriaMet: ["addresses_significant_risk", "quantitative_threshold"],
    keyControl: true,
  },
} satisfies ToolExample<
  KeyControlDesignationInput,
  KeyControlDesignationOutput
>;

export const keyControlDesignationTool = createSimpleTool({
  calculate: (input) =>
    designateKeyControl({
      addressesSignificantRisk: input.addressesSignificantRisk as boolean,
      quantitativeEffect: input.quantitativeEffect as number,
      qualitativeRisk: input.qualitativeRisk as boolean,
      quantitativeLimit: input.quantitativeLimit as number,
      quantitativeThreshold: input.quantitativeThreshold as number,
    }),
  description:
    "Evaluate caller-defined significant-risk, qualitative-risk, and quantitative criteria and report which criteria support key-control designation.",
  id: "auditing/key-vs-non-key-control-designation-criteria-lookup",
  inputs: [
    {
      id: "addressesSignificantRisk",
      kind: "boolean",
      label: "Addresses significant risk",
    },
    {
      id: "quantitativeEffect",
      kind: "number",
      label: "Quantitative effect",
      minimum: 0,
    },
    { id: "qualitativeRisk", kind: "boolean", label: "Qualitative risk" },
    {
      id: "quantitativeLimit",
      kind: "number",
      label: "Quantitative upper limit",
      minimum: 0,
    },
    {
      id: "quantitativeThreshold",
      kind: "number",
      label: "Quantitative designation threshold",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "criteriaMet", kind: "stringList", label: "Criteria met" },
    { id: "keyControl", kind: "boolean", label: "Designate as key control" },
  ],
  title: "Key vs Non-Key Control Designation Criteria Lookup",
});

export const runKeyControlDesignation = keyControlDesignationTool.execute;
export default keyControlDesignationTool;
