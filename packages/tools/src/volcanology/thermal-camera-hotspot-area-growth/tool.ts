import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesDays: readonly number[];
  readonly pixelTemperaturesByFrameC: readonly (readonly number[])[];
  readonly pixelAreasM2: readonly number[];
  readonly callerHotspotThresholdC: number;
}>;
export type Output = Readonly<{
  readonly hotspotAreasM2: readonly number[];
  readonly hotspotAreaChangeM2PerDay: number;
  readonly temperatureExcessAreaIntegralsCM2: readonly number[];
}>;
const inputFields = [
  { id: "timesDays", label: "Times days", kind: "numberList" },
  {
    id: "pixelTemperaturesByFrameC",
    label: "Pixel temperatures by frame c",
    kind: "matrix",
  },
  { id: "pixelAreasM2", label: "Pixel areas m2", kind: "numberList" },
  {
    id: "callerHotspotThresholdC",
    label: "Caller hotspot threshold c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.pixelAreasM2.forEach((v) => positive(v, "pixelAreasM2"));
  ordered(input.timesDays, "timesDays");
  aligned(input.timesDays, input.pixelTemperaturesByFrameC, "frames");
  if (
    input.pixelTemperaturesByFrameC.some(
      (row) => row.length !== input.pixelAreasM2.length,
    )
  )
    simpleError(
      "pixelAreasM2",
      "All thermal frames must use matched calibrated pixel areas.",
    );
  const hotspotAreasM2 = input.pixelTemperaturesByFrameC.map((row) =>
      row.reduce(
        (s, t, i) =>
          s + (t > input.callerHotspotThresholdC ? input.pixelAreasM2[i] : 0),
        0,
      ),
    ),
    temperatureExcessAreaIntegralsCM2 = input.pixelTemperaturesByFrameC.map(
      (row) =>
        row.reduce(
          (s, t, i) =>
            s +
            Math.max(0, t - input.callerHotspotThresholdC) *
              input.pixelAreasM2[i],
          0,
        ),
    );
  return {
    hotspotAreasM2,
    hotspotAreaChangeM2PerDay: regression(input.timesDays, hotspotAreasM2)
      .slope,
    temperatureExcessAreaIntegralsCM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesDays: [0, 1],
  pixelTemperaturesByFrameC: [
    [10, 30, 40],
    [20, 25, 50],
  ],
  pixelAreasM2: [1, 2, 3],
  callerHotspotThresholdC: 30,
} satisfies Input;
export const exampleOutput = {
  hotspotAreasM2: [3, 3],
  hotspotAreaChangeM2PerDay: 0,
  temperatureExcessAreaIntegralsCM2: [30, 60],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/thermal-camera-hotspot-area-growth",
  title: "Thermal Camera Hotspot Area Growth Tracker",
  description:
    "Track thresholded physical area and temperature-excess area from calibrated thermal pixels; strict threshold equality is excluded, and emissivity/atmospheric correction or mapped coordinates are caller preprocessing.",
  inputs: inputFields,
  outputs: [
    { id: "hotspotAreasM2", label: "Hotspot areas m2", kind: "numberList" },
    {
      id: "hotspotAreaChangeM2PerDay",
      label: "Hotspot area change m2 per day",
      kind: "number",
    },
    {
      id: "temperatureExcessAreaIntegralsCM2",
      label: "Temperature excess area integrals c m2",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      timesDays: value.timesDays as readonly number[],
      pixelTemperaturesByFrameC:
        value.pixelTemperaturesByFrameC as readonly (readonly number[])[],
      pixelAreasM2: value.pixelAreasM2 as readonly number[],
      callerHotspotThresholdC: value.callerHotspotThresholdC as number,
    }),
});
export const run = tool.execute;
export default tool;
