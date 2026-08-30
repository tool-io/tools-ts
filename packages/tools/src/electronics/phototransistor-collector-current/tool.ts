import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhototransistorCollectorCurrentInput = Readonly<{
  readonly opticalWatts: number;
  readonly responsivityAmperesPerWatt: number;
  readonly currentGain: number;
}>;
export type PhototransistorCollectorCurrentOutput = Readonly<{
  readonly collectorAmperes: number;
}>;

export const calculatePhototransistorCollectorCurrent = (
  x: PhototransistorCollectorCurrentInput,
): PhototransistorCollectorCurrentOutput => {
  if (!Number.isFinite(x.opticalWatts) || x.opticalWatts < 0)
    simpleError("opticalWatts", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.responsivityAmperesPerWatt) ||
    x.responsivityAmperesPerWatt < 0
  )
    simpleError(
      "responsivityAmperesPerWatt",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.currentGain) || x.currentGain < 0)
    simpleError("currentGain", "Provide a finite number at least 0.");
  const collectorAmperes =
    x.opticalWatts * x.responsivityAmperesPerWatt * x.currentGain;
  if (!Number.isFinite(collectorAmperes))
    simpleError(
      "collectorAmperes",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    collectorAmperes: Object.is(collectorAmperes, -0) ? 0 : collectorAmperes,
  };
};

export const example = {
  input: {
    opticalWatts: 0.001,
    responsivityAmperesPerWatt: 0.5,
    currentGain: 100,
  },
  output: { collectorAmperes: 0.05 },
} satisfies ToolExample<
  PhototransistorCollectorCurrentInput,
  PhototransistorCollectorCurrentOutput
>;

export const tool = createSimpleTool({
  id: "electronics/phototransistor-collector-current",
  title: "Phototransistor Collector Current",
  description:
    "Approximate phototransistor collector current from incident optical power, photodiode responsivity and transistor current gain.",
  inputs: [
    {
      id: "opticalWatts",
      kind: "number",
      label: "Optical Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "responsivityAmperesPerWatt",
      kind: "number",
      label: "Responsivity Amperes Per Watt",
      unit: "A/W",
      minimum: 0,
    },
    { id: "currentGain", kind: "number", label: "Current Gain", minimum: 0 },
  ],
  outputs: [
    {
      id: "collectorAmperes",
      kind: "number",
      label: "Collector Amperes",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculatePhototransistorCollectorCurrent({
      opticalWatts: input.opticalWatts as number,
      responsivityAmperesPerWatt: input.responsivityAmperesPerWatt as number,
      currentGain: input.currentGain as number,
    }),
});
export const phototransistorCollectorCurrentTool = tool;
export const runPhototransistorCollectorCurrent = tool.execute;
export default tool;
