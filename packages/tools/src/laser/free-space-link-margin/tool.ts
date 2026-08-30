import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly transmitPowerDbm: number;
  readonly transmitGainDb: number;
  readonly receiveGainDb: number;
  readonly pathLossDb: number;
  readonly receiverSensitivityDbm: number;
}>;
export type Output = Readonly<{
  readonly receivedPowerDbm: number;
  readonly linkMarginDb: number;
  readonly closesLink: boolean;
}>;

export const calculate = (input: Input): Output => {
  const receivedPowerDbm =
    input.transmitPowerDbm +
    input.transmitGainDb +
    input.receiveGainDb -
    input.pathLossDb;
  const linkMarginDb = receivedPowerDbm - input.receiverSensitivityDbm;
  return { receivedPowerDbm, linkMarginDb, closesLink: linkMarginDb >= 0 };
};

export const exampleInput = {
  transmitPowerDbm: 20,
  transmitGainDb: 10,
  receiveGainDb: 10,
  pathLossDb: 5,
  receiverSensitivityDbm: -60,
} satisfies Input;
export const exampleOutput = {
  receivedPowerDbm: 35,
  linkMarginDb: 95,
  closesLink: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      transmitPowerDbm: input.transmitPowerDbm as number,
      transmitGainDb: input.transmitGainDb as number,
      receiveGainDb: input.receiveGainDb as number,
      pathLossDb: input.pathLossDb as number,
      receiverSensitivityDbm: input.receiverSensitivityDbm as number,
    }),
  description:
    "Calculate a free-space optical link budget from caller-supplied gains, losses, and sensitivity.",
  id: "laser/free-space-link-margin",
  inputs: [
    {
      id: "transmitPowerDbm",
      label: "Transmit power",
      kind: "number",
      unit: "dBm",
    },
    {
      id: "transmitGainDb",
      label: "Transmit gain",
      kind: "number",
      unit: "dB",
    },
    { id: "receiveGainDb", label: "Receive gain", kind: "number", unit: "dB" },
    {
      id: "pathLossDb",
      label: "Path and weather loss",
      kind: "number",
      minimum: 0,
      unit: "dB",
    },
    {
      id: "receiverSensitivityDbm",
      label: "Receiver sensitivity",
      kind: "number",
      unit: "dBm",
    },
  ],
  outputs: [
    {
      id: "receivedPowerDbm",
      label: "Received power",
      kind: "number",
      unit: "dBm",
    },
    { id: "linkMarginDb", label: "Link margin", kind: "number", unit: "dB" },
    { id: "closesLink", label: "Closes link", kind: "boolean" },
  ],
  title: "Free-Space Link Margin",
});

export const run = tool.execute;
export default tool;
