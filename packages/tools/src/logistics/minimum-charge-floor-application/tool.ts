import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MinimumChargeFloorApplicationInput = {
  readonly quotedChargeUsd: number;
  readonly minimumChargeUsd: number;
};

export type MinimumChargeFloorApplicationOutput = {
  readonly floorApplied: boolean;
  readonly billedChargeUsd: number;
  readonly shortfallUsd: number;
};

export const calculateMinimumChargeFloorApplication = (
  input: MinimumChargeFloorApplicationInput,
): MinimumChargeFloorApplicationOutput => {
  if (!Number.isFinite(input.quotedChargeUsd) || input.quotedChargeUsd < 0)
    return simpleError(
      "quotedChargeUsd",
      "The quoted charge must be finite and non-negative.",
      "invalid_amount",
    );
  if (!Number.isFinite(input.minimumChargeUsd) || input.minimumChargeUsd < 0)
    return simpleError(
      "minimumChargeUsd",
      "The minimum charge must be finite and non-negative.",
      "invalid_amount",
    );
  const floorApplied = input.quotedChargeUsd < input.minimumChargeUsd;
  return {
    floorApplied,
    billedChargeUsd: Math.max(input.quotedChargeUsd, input.minimumChargeUsd),
    shortfallUsd: floorApplied
      ? input.minimumChargeUsd - input.quotedChargeUsd
      : 0,
  };
};

export const minimumChargeFloorApplicationExample = {
  input: { quotedChargeUsd: 187.3, minimumChargeUsd: 225.5 },
  output: {
    floorApplied: true,
    billedChargeUsd: 225.5,
    shortfallUsd: 38.19999999999999,
  },
} satisfies ToolExample<
  MinimumChargeFloorApplicationInput,
  MinimumChargeFloorApplicationOutput
>;

export const minimumChargeFloorApplicationTool = createSimpleTool({
  id: "logistics/minimum-charge-floor-application",
  title: "Minimum Charge Floor Application",
  description:
    "Raise a rated freight charge to the carrier's minimum charge and report the shortfall the floor introduces.",
  inputs: [
    {
      description: "Rated charge from the rate calculation.",
      id: "quotedChargeUsd",
      kind: "number",
      label: "Quoted charge",
      minimum: 0,
      unit: "USD",
    },
    {
      description: "Carrier minimum charge.",
      id: "minimumChargeUsd",
      kind: "number",
      label: "Minimum charge",
      minimum: 0,
      unit: "USD",
    },
  ],
  outputs: [
    {
      description: "Whether the minimum charge replaced the quoted amount.",
      id: "floorApplied",
      kind: "boolean",
      label: "Floor applied",
    },
    {
      description: "Charge actually billed.",
      id: "billedChargeUsd",
      kind: "number",
      label: "Billed charge",
      minimum: 0,
      unit: "USD",
    },
    {
      description: "Amount added by the floor (zero when not applied).",
      id: "shortfallUsd",
      kind: "number",
      label: "Shortfall",
      minimum: 0,
      unit: "USD",
    },
  ],
  calculate: (input) =>
    calculateMinimumChargeFloorApplication({
      minimumChargeUsd: input.minimumChargeUsd as number,
      quotedChargeUsd: input.quotedChargeUsd as number,
    }),
});

export const runMinimumChargeFloorApplication =
  minimumChargeFloorApplicationTool.execute;
export default minimumChargeFloorApplicationTool;
