import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContainerPayloadWeightCheckerInput = {
  readonly cargoWeightKg: number;
  readonly packingMaterialKg?: number;
  readonly maximumPayloadKg: number;
};

export type ContainerPayloadWeightCheckerOutput = {
  readonly totalLoadedWeightKg: number;
  readonly remainingPayloadKg: number;
  readonly withinPayloadLimit: boolean;
};

export const calculateContainerPayloadWeightChecker = (
  input: ContainerPayloadWeightCheckerInput,
): ContainerPayloadWeightCheckerOutput => {
  if (!Number.isFinite(input.cargoWeightKg) || input.cargoWeightKg < 0)
    return simpleError(
      "cargoWeightKg",
      "Cargo weight must be finite and non-negative.",
      "invalid_weight",
    );
  const packingMaterialKg = input.packingMaterialKg ?? 0;
  if (!Number.isFinite(packingMaterialKg) || packingMaterialKg < 0)
    return simpleError(
      "packingMaterialKg",
      "Packing material weight must be finite and non-negative.",
      "invalid_weight",
    );
  if (!Number.isFinite(input.maximumPayloadKg) || input.maximumPayloadKg <= 0)
    return simpleError(
      "maximumPayloadKg",
      "The payload limit must be finite and greater than zero.",
      "invalid_limit",
    );
  const totalLoadedWeightKg = input.cargoWeightKg + packingMaterialKg;
  if (!Number.isFinite(totalLoadedWeightKg))
    return simpleError(
      "cargoWeightKg",
      "Loaded weight is outside the representable range.",
      "weight_out_of_range",
    );
  return {
    totalLoadedWeightKg,
    remainingPayloadKg: input.maximumPayloadKg - totalLoadedWeightKg,
    withinPayloadLimit: totalLoadedWeightKg <= input.maximumPayloadKg,
  };
};

export const containerPayloadWeightCheckerExample = {
  input: {
    cargoWeightKg: 21300,
    packingMaterialKg: 350,
    maximumPayloadKg: 28000,
  },
  output: {
    totalLoadedWeightKg: 21650,
    remainingPayloadKg: 6350,
    withinPayloadLimit: true,
  },
} satisfies ToolExample<
  ContainerPayloadWeightCheckerInput,
  ContainerPayloadWeightCheckerOutput
>;

export const containerPayloadWeightCheckerTool = createSimpleTool({
  id: "logistics/container-payload-weight-checker",
  title: "Container Payload Weight Checker",
  description:
    "Sum cargo and packing material weights and check the total against a container or road-leg payload limit.",
  inputs: [
    {
      description: "Cargo weight in kilograms.",
      id: "cargoWeightKg",
      kind: "number",
      label: "Cargo",
      minimum: 0,
      unit: "kg",
    },
    {
      default: 0,
      description: "Packing, dunnage and bracing material in kilograms.",
      id: "packingMaterialKg",
      kind: "number",
      label: "Packing",
      minimum: 0,
      unit: "kg",
    },
    {
      description:
        "Maximum permitted payload in kilograms from your equipment or road limits.",
      id: "maximumPayloadKg",
      kind: "number",
      label: "Max payload",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description:
        "Total loaded weight including packing material, in kilograms.",
      id: "totalLoadedWeightKg",
      kind: "number",
      label: "Loaded weight",
      minimum: 0,
      unit: "kg",
    },
    {
      description:
        "Payload capacity still available; a negative value is the overload amount.",
      id: "remainingPayloadKg",
      kind: "number",
      label: "Remaining",
      unit: "kg",
    },
    {
      description: "Whether the load respects the payload limit.",
      id: "withinPayloadLimit",
      kind: "boolean",
      label: "Within limit",
    },
  ],
  calculate: (input) =>
    calculateContainerPayloadWeightChecker({
      cargoWeightKg: input.cargoWeightKg as number,
      maximumPayloadKg: input.maximumPayloadKg as number,
      packingMaterialKg: input.packingMaterialKg as number | undefined,
    }),
});

export const runContainerPayloadWeightChecker =
  containerPayloadWeightCheckerTool.execute;
export default containerPayloadWeightCheckerTool;
