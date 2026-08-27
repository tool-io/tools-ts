import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CuttingsTransportVelocityInput = {
  readonly annularVelocityMetresPerSecond: number;
  readonly particleSlipVelocityMetresPerSecond: number;
};

export type CuttingsTransportVelocityOutput = {
  readonly transportRatio: number;
  readonly transportVelocityMetresPerSecond: number;
};

export const calculateCuttingsTransportVelocity = (
  input: CuttingsTransportVelocityInput,
): CuttingsTransportVelocityOutput => {
  if (!(input.annularVelocityMetresPerSecond > 0))
    return simpleError(
      "annularVelocityMetresPerSecond",
      "Annular velocity must be greater than zero.",
      "invalid_velocity",
    );
  if (!(input.particleSlipVelocityMetresPerSecond >= 0))
    return simpleError(
      "particleSlipVelocityMetresPerSecond",
      "Slip velocity cannot be negative.",
      "invalid_velocity",
    );
  if (
    !(
      input.particleSlipVelocityMetresPerSecond <
      input.annularVelocityMetresPerSecond
    )
  )
    return simpleError(
      "particleSlipVelocityMetresPerSecond",
      "Cuttings are not being transported: slip velocity must stay below the annular velocity.",
      "no_transport",
    );
  const transportVelocityMetresPerSecond =
    input.annularVelocityMetresPerSecond -
    input.particleSlipVelocityMetresPerSecond;
  return {
    transportVelocityMetresPerSecond,
    transportRatio:
      transportVelocityMetresPerSecond / input.annularVelocityMetresPerSecond,
  };
};

export const cuttingsTransportVelocityExample = {
  input: {
    annularVelocityMetresPerSecond: 1.2,
    particleSlipVelocityMetresPerSecond: 0.35,
  },
  output: {
    transportVelocityMetresPerSecond: 0.85,
    transportRatio: 0.7083333333333334,
  },
} satisfies ToolExample<
  CuttingsTransportVelocityInput,
  CuttingsTransportVelocityOutput
>;

export const cuttingsTransportVelocityTool = createSimpleTool({
  id: "geology/cuttings-transport-velocity",
  title: "Cuttings Transport Velocity Calculator",
  description:
    "Determine the net rise velocity and transport ratio of drill cuttings from annular velocity and particle slip velocity.",
  inputs: [
    {
      description: "Mean fluid velocity in the annulus in metres per second.",
      id: "annularVelocityMetresPerSecond",
      kind: "number",
      label: "Annular velocity",
    },
    {
      description: "Particle slip (settling) velocity in metres per second.",
      id: "particleSlipVelocityMetresPerSecond",
      kind: "number",
      label: "Slip velocity",
    },
  ],
  outputs: [
    {
      description:
        "Net upward transport velocity of cuttings in metres per second.",
      id: "transportVelocityMetresPerSecond",
      kind: "number",
      label: "Transport velocity",
    },
    {
      description:
        "Transport ratio (transport velocity over annular velocity).",
      id: "transportRatio",
      kind: "number",
      label: "Transport ratio",
    },
  ],
  calculate: (input) =>
    calculateCuttingsTransportVelocity(
      input as unknown as CuttingsTransportVelocityInput,
    ),
});

export const runCuttingsTransportVelocity =
  cuttingsTransportVelocityTool.execute;
export default cuttingsTransportVelocityTool;
