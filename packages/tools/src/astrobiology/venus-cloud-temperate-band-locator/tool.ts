import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  aligned,
  strictlyIncreasing,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyObservedAltitudeKm: readonly number[];
  readonly independentlyObservedTemperaturesKelvin: readonly number[];
  readonly callerMinimumTemperatureKelvin: number;
  readonly callerMaximumTemperatureKelvin: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyObservedAltitudeKm",
    label: "Independently observed altitude km",
    kind: "numberList",
  },
  {
    id: "independentlyObservedTemperaturesKelvin",
    label: "Independently observed temperatures kelvin",
    kind: "numberList",
  },
  {
    id: "callerMinimumTemperatureKelvin",
    label: "Caller minimum temperature kelvin",
    kind: "number",
  },
  {
    id: "callerMaximumTemperatureKelvin",
    label: "Caller maximum temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyObservedAltitudeKm,
    input.independentlyObservedTemperaturesKelvin,
    "profile",
  );
  strictlyIncreasing(input.independentlyObservedAltitudeKm, "altitude", 2);
  input.independentlyObservedTemperaturesKelvin.forEach((v) =>
    positive(v, "temperature"),
  );
  positive(input.callerMinimumTemperatureKelvin, "minimum");
  if (
    input.callerMaximumTemperatureKelvin < input.callerMinimumTemperatureKelvin
  )
    simpleError("window", "Ordered temperature window.");
  const starts: number[] = [],
    ends: number[] = [];
  for (let i = 1; i < input.independentlyObservedAltitudeKm.length; i++) {
    const a = input.independentlyObservedTemperaturesKelvin[i - 1],
      b = input.independentlyObservedTemperaturesKelvin[i],
      x = input.independentlyObservedAltitudeKm[i - 1],
      y = input.independentlyObservedAltitudeKm[i];
    let lo = 0,
      hi = 1;
    if (a === b) {
      if (
        a < input.callerMinimumTemperatureKelvin ||
        a > input.callerMaximumTemperatureKelvin
      )
        continue;
    } else {
      const p = (input.callerMinimumTemperatureKelvin - a) / (b - a),
        q = (input.callerMaximumTemperatureKelvin - a) / (b - a);
      lo = Math.max(0, Math.min(p, q));
      hi = Math.min(1, Math.max(p, q));
      if (lo > hi) continue;
    }
    const s = x + (y - x) * lo,
      e = x + (y - x) * hi;
    if (ends.length && ends.at(-1) === s) ends[ends.length - 1] = e;
    else {
      starts.push(s);
      ends.push(e);
    }
  }
  return {
    conditionalSegmentStartAltitudesKm: starts,
    conditionalSegmentEndAltitudesKm: ends,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyObservedAltitudeKm: [40, 50, 60],
    independentlyObservedTemperaturesKelvin: [400, 300, 200],
    callerMinimumTemperatureKelvin: 250,
    callerMaximumTemperatureKelvin: 350,
  },
  output: {
    result: {
      conditionalSegmentStartAltitudesKm: [45],
      conditionalSegmentEndAltitudesKm: [55],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/venus-cloud-temperate-band-locator",
  title: "Venus Cloud Layer Temperate Altitude Band Locator km",
  description:
    "Find temperature-window intervals in actual sampled Venusaltitude/temperature profile under explicit piecewise-linear interpolation. All disjoint segments retained, no extrapolation, universal cloud band, pressure/acidity/water viability or life claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
