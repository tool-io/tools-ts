import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CryonicsInformationThresholdInput = {
  readonly recoverableInformationBits: number;
  readonly requiredInformationBits: number;
  readonly storedInformationBits: number;
};

export type CryonicsInformationThresholdOutput = {
  readonly caution: string;
  readonly retainedInformationPercent: number;
  readonly thresholdMet: boolean;
};

export const assessCryonicsInformationThreshold = (
  input: CryonicsInformationThresholdInput,
): CryonicsInformationThresholdOutput => {
  for (const [field, value] of [
    ["storedInformationBits", input.storedInformationBits],
    ["requiredInformationBits", input.requiredInformationBits],
    ["recoverableInformationBits", input.recoverableInformationBits],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "Information values must be finite and nonnegative.",
        "information_value_invalid",
      );
  if (input.storedInformationBits === 0)
    simpleError(
      "storedInformationBits",
      "Stored information must be greater than zero.",
      "stored_information_required",
    );
  if (input.requiredInformationBits === 0)
    simpleError(
      "requiredInformationBits",
      "Required information must be greater than zero.",
      "required_information_required",
    );
  if (input.recoverableInformationBits > input.storedInformationBits)
    simpleError(
      "recoverableInformationBits",
      "Recoverable information cannot exceed stored information.",
      "recoverable_information_exceeds_stored",
    );
  const retainedInformationPercent =
    (input.recoverableInformationBits / input.storedInformationBits) * 100;
  return {
    caution:
      "This caller-defined information threshold is not a validated threshold of biological death or a guarantee of recoverability.",
    retainedInformationPercent: Number.isFinite(retainedInformationPercent)
      ? retainedInformationPercent
      : 0,
    thresholdMet:
      input.recoverableInformationBits >= input.requiredInformationBits,
  };
};

export const cryonicsInformationThresholdExample = {
  input: {
    recoverableInformationBits: 80,
    requiredInformationBits: 90,
    storedInformationBits: 100,
  },
  output: {
    caution:
      "This caller-defined information threshold is not a validated threshold of biological death or a guarantee of recoverability.",
    retainedInformationPercent: 80,
    thresholdMet: false,
  },
} satisfies ToolExample<
  CryonicsInformationThresholdInput,
  CryonicsInformationThresholdOutput
>;

export const cryonicsInformationThresholdTool = createSimpleTool({
  calculate: (input) =>
    assessCryonicsInformationThreshold({
      recoverableInformationBits: input.recoverableInformationBits as number,
      requiredInformationBits: input.requiredInformationBits as number,
      storedInformationBits: input.storedInformationBits as number,
    }),
  description:
    "Compare caller-supplied recoverable information with a custom threshold while explicitly avoiding a biological-death claim.",
  id: "futurology/cryonics-information-theoretic-death-threshold-lookup",
  inputs: [
    {
      id: "recoverableInformationBits",
      kind: "number",
      label: "Recoverable information bits",
      minimum: 0,
    },
    {
      id: "requiredInformationBits",
      kind: "number",
      label: "Required information bits",
      minimum: 0,
    },
    {
      id: "storedInformationBits",
      kind: "number",
      label: "Stored information bits",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "caution", kind: "string", label: "Threshold caution" },
    {
      id: "retainedInformationPercent",
      kind: "number",
      label: "Retained information percent",
      minimum: 0,
      unit: "%",
    },
    { id: "thresholdMet", kind: "boolean", label: "Custom threshold met" },
  ],
  title: "Cryonics Information Theoretic Death Threshold Lookup",
});

export const runCryonicsInformationThreshold =
  cryonicsInformationThresholdTool.execute;
export default cryonicsInformationThresholdTool;
