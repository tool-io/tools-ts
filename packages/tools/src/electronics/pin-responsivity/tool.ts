import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PinResponsivityInput = Readonly<{
  readonly photocurrentA: number;
  readonly incidentOpticalPowerW: number;
}>;
export type PinResponsivityOutput = Readonly<{
  readonly responsivityAPerW: number;
}>;

export const calculatePinResponsivity = (
  x: PinResponsivityInput,
): PinResponsivityOutput => {
  if (!Number.isFinite(x.photocurrentA) || x.photocurrentA < 0)
    simpleError("photocurrentA", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.incidentOpticalPowerW) || x.incidentOpticalPowerW < 0)
    simpleError("incidentOpticalPowerW", "Provide a finite number at least 0.");
  if (!(x.incidentOpticalPowerW > 0))
    simpleError("incidentOpticalPowerW", "Optical power must be positive.");
  const responsivityAPerW = x.photocurrentA / x.incidentOpticalPowerW;
  if (!Number.isFinite(responsivityAPerW))
    simpleError("responsivityAPerW", "The inputs produce an invalid result.");
  return {
    responsivityAPerW: Object.is(responsivityAPerW, -0) ? 0 : responsivityAPerW,
  };
};

export const example = {
  input: { photocurrentA: 0.001, incidentOpticalPowerW: 0.002 },
  output: { responsivityAPerW: 0.5 },
} satisfies ToolExample<PinResponsivityInput, PinResponsivityOutput>;

export const tool = createSimpleTool({
  id: "electronics/pin-responsivity",
  title: "PIN Responsivity",
  description:
    "Calculate a PIN photodiode's measured electrical responsivity from dark-subtracted photocurrent and incident optical power.",
  inputs: [
    {
      id: "photocurrentA",
      kind: "number",
      label: "Dark-subtracted photocurrent",
      unit: "A",
      minimum: 0,
    },
    {
      id: "incidentOpticalPowerW",
      kind: "number",
      label: "Incident optical power",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "responsivityAPerW",
      kind: "number",
      label: "Electrical responsivity",
      unit: "A/W",
    },
  ],
  calculate: (input) =>
    calculatePinResponsivity({
      photocurrentA: input.photocurrentA as number,
      incidentOpticalPowerW: input.incidentOpticalPowerW as number,
    }),
});
export const pinResponsivityTool = tool;
export const runPinResponsivity = tool.execute;
export default tool;
