import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type SweeteningReserveVolumeInput = {
  readonly dryRsGPerL?: number;
  readonly dryWineVolumeLiters: number;
  readonly reserveRsGPerL: number;
  readonly targetRsGPerL: number;
};

export type SweeteningReserveVolumeOutput = {
  readonly reserveVolumeLiters: number;
};

export const sweeteningReserveVolumeExample = {
  input: {
    dryRsGPerL: 2,
    dryWineVolumeLiters: 1000,
    reserveRsGPerL: 180,
    targetRsGPerL: 8,
  },
  output: {
    reserveVolumeLiters: 34.8837209302,
  },
} satisfies ToolExample<
  SweeteningReserveVolumeInput,
  SweeteningReserveVolumeOutput
>;

export const calculateSweeteningReserveVolume = (
  input: SweeteningReserveVolumeInput,
): SweeteningReserveVolumeOutput => {
  const dryRs = input.dryRsGPerL ?? 0;
  if (input.reserveRsGPerL <= input.targetRsGPerL)
    simpleError(
      "reserveRsGPerL",
      "The sweet reserve must be sweeter than the target residual sugar.",
      "invalid_target",
    );
  if (input.targetRsGPerL < dryRs)
    simpleError(
      "targetRsGPerL",
      "The target residual sugar must sit at or above the dry wine's own value.",
      "invalid_target",
    );
  return {
    reserveVolumeLiters: roundStatistic(
      (input.dryWineVolumeLiters * (input.targetRsGPerL - dryRs)) /
        (input.reserveRsGPerL - input.targetRsGPerL),
    ),
  };
};

export const sweeteningReserveVolumeTool = createSimpleTool({
  calculate: (input) =>
    calculateSweeteningReserveVolume(
      input as unknown as SweeteningReserveVolumeInput,
    ),
  description:
    "Solve the sweetening reserve volume that lifts a dry lot to the target residual sugar by sugar mass balance.",
  id: "oenology/sweetening-reserve-volume",
  inputs: [
    {
      default: 0,
      description: "Residual sugar of the dry wine.",
      id: "dryRsGPerL",
      kind: "number",
      label: "Dry wine RS",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Dry wine volume to sweeten.",
      id: "dryWineVolumeLiters",
      kind: "number",
      label: "Dry wine volume",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Residual sugar of the preserved sweet reserve juice.",
      id: "reserveRsGPerL",
      kind: "number",
      label: "Reserve RS",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Target residual sugar for the finished blend.",
      id: "targetRsGPerL",
      kind: "number",
      label: "Target RS",
      minimum: 0,
      unit: "g/L",
    },
  ],
  outputs: [
    {
      description: "Sweet reserve to blend into the dry wine.",
      id: "reserveVolumeLiters",
      kind: "number",
      label: "Reserve volume",
      unit: "L",
    },
  ],
  title: "Sweetening Reserve Volume Calculator",
});
export const runSweeteningReserveVolume = sweeteningReserveVolumeTool.execute;
export default sweeteningReserveVolumeTool;
