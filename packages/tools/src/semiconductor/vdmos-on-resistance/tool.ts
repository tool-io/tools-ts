import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VdmosOnResistanceInput = Readonly<{
  readonly sourceOhms: number;
  readonly channelOhms: number;
  readonly driftOhms: number;
  readonly substrateOhms: number;
  readonly contactOhms: number;
}>;
export type VdmosOnResistanceOutput = Readonly<{
  readonly onOhms: number;
}>;

export const calculateVdmosOnResistance = (
  x: VdmosOnResistanceInput,
): VdmosOnResistanceOutput => {
  if (!Number.isFinite(x.sourceOhms) || x.sourceOhms < 0)
    simpleError("sourceOhms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.channelOhms) || x.channelOhms < 0)
    simpleError("channelOhms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.driftOhms) || x.driftOhms < 0)
    simpleError("driftOhms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.substrateOhms) || x.substrateOhms < 0)
    simpleError("substrateOhms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.contactOhms) || x.contactOhms < 0)
    simpleError("contactOhms", "Provide a finite number at least 0.");
  const onOhms =
    x.sourceOhms +
    x.channelOhms +
    x.driftOhms +
    x.substrateOhms +
    x.contactOhms;
  if (!Number.isFinite(onOhms))
    simpleError(
      "onOhms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { onOhms: Object.is(onOhms, -0) ? 0 : onOhms };
};

export const example = {
  input: {
    sourceOhms: 0.01,
    channelOhms: 0.02,
    driftOhms: 0.03,
    substrateOhms: 0.01,
    contactOhms: 0.01,
  },
  output: { onOhms: 0.07999999999999999 },
} satisfies ToolExample<VdmosOnResistanceInput, VdmosOnResistanceOutput>;

export const tool = createSimpleTool({
  id: "semiconductor/vdmos-on-resistance",
  title: "VDMOS On Resistance",
  description:
    "Total VDMOS on-resistance from measured or modeled positive series resistance components at the same operating temperature.",
  inputs: [
    {
      id: "sourceOhms",
      kind: "number",
      label: "Source Ohms",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "channelOhms",
      kind: "number",
      label: "Channel Ohms",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "driftOhms",
      kind: "number",
      label: "Drift Ohms",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "substrateOhms",
      kind: "number",
      label: "Substrate Ohms",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "contactOhms",
      kind: "number",
      label: "Contact Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [{ id: "onOhms", kind: "number", label: "On Ohms", unit: "Ω" }],
  calculate: (input) =>
    calculateVdmosOnResistance({
      sourceOhms: input.sourceOhms as number,
      channelOhms: input.channelOhms as number,
      driftOhms: input.driftOhms as number,
      substrateOhms: input.substrateOhms as number,
      contactOhms: input.contactOhms as number,
    }),
});
export const vdmosOnResistanceTool = tool;
export const runVdmosOnResistance = tool.execute;
export default tool;
