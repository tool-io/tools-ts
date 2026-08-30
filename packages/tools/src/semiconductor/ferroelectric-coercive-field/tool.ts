import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FerroelectricCoerciveFieldInput = Readonly<{
  readonly coerciveVolts: number;
  readonly filmMeters: number;
}>;
export type FerroelectricCoerciveFieldOutput = Readonly<{
  readonly coerciveVoltsPerMeter: number;
}>;

export const calculateFerroelectricCoerciveField = (
  x: FerroelectricCoerciveFieldInput,
): FerroelectricCoerciveFieldOutput => {
  if (!Number.isFinite(x.coerciveVolts) || x.coerciveVolts < 0)
    simpleError("coerciveVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.filmMeters) || x.filmMeters < 0)
    simpleError("filmMeters", "Provide a finite number at least 0.");
  const coerciveVoltsPerMeter = x.coerciveVolts / x.filmMeters;
  if (!Number.isFinite(coerciveVoltsPerMeter))
    simpleError(
      "coerciveVoltsPerMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    coerciveVoltsPerMeter: Object.is(coerciveVoltsPerMeter, -0)
      ? 0
      : coerciveVoltsPerMeter,
  };
};

export const example = {
  input: { coerciveVolts: 1, filmMeters: 1e-7 },
  output: { coerciveVoltsPerMeter: 10000000 },
} satisfies ToolExample<
  FerroelectricCoerciveFieldInput,
  FerroelectricCoerciveFieldOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/ferroelectric-coercive-field",
  title: "Ferroelectric Coercive Field",
  description:
    "Ferroelectric coercive-field magnitude from a measured coercive-voltage magnitude and active film thickness.",
  inputs: [
    {
      id: "coerciveVolts",
      kind: "number",
      label: "Coercive Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "filmMeters",
      kind: "number",
      label: "Film Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "coerciveVoltsPerMeter",
      kind: "number",
      label: "Coercive Volts Per Meter",
      unit: "V/m",
    },
  ],
  calculate: (input) =>
    calculateFerroelectricCoerciveField({
      coerciveVolts: input.coerciveVolts as number,
      filmMeters: input.filmMeters as number,
    }),
});
export const ferroelectricCoerciveFieldTool = tool;
export const runFerroelectricCoerciveField = tool.execute;
export default tool;
