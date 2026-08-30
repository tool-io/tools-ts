import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FootingBearingPressureInput = Readonly<{
  readonly verticalLoadN: number;
  readonly contactAreaM2: number;
}>;
export type FootingBearingPressureOutput = Readonly<{
  readonly averagePressurePa: number;
}>;

export const calculateFootingBearingPressure = (
  x: FootingBearingPressureInput,
): FootingBearingPressureOutput => {
  if (!Number.isFinite(x.verticalLoadN) || x.verticalLoadN < 0)
    simpleError("verticalLoadN", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.contactAreaM2) || x.contactAreaM2 < 0)
    simpleError("contactAreaM2", "Provide a finite number at least 0.");
  if (!(x.contactAreaM2 > 0))
    simpleError("contactAreaM2", "Contact area must be positive.");
  const averagePressurePa = x.verticalLoadN / x.contactAreaM2;
  if (!Number.isFinite(averagePressurePa))
    simpleError("averagePressurePa", "The inputs produce an invalid result.");
  return {
    averagePressurePa: Object.is(averagePressurePa, -0) ? 0 : averagePressurePa,
  };
};

export const example = {
  input: { verticalLoadN: 100000, contactAreaM2: 2 },
  output: { averagePressurePa: 50000 },
} satisfies ToolExample<
  FootingBearingPressureInput,
  FootingBearingPressureOutput
>;

export const tool = createSimpleTool({
  id: "construction/footing-bearing-pressure",
  title: "Footing Bearing Pressure",
  description:
    "Calculate average bearing pressure from centered vertical footing load and effective contact area; excludes eccentricity and soil capacity checks.",
  inputs: [
    {
      id: "verticalLoadN",
      kind: "number",
      label: "Centered vertical load",
      unit: "N",
      minimum: 0,
    },
    {
      id: "contactAreaM2",
      kind: "number",
      label: "Effective contact area",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "averagePressurePa",
      kind: "number",
      label: "Average bearing pressure",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateFootingBearingPressure({
      verticalLoadN: input.verticalLoadN as number,
      contactAreaM2: input.contactAreaM2 as number,
    }),
});
export const footingBearingPressureTool = tool;
export const runFootingBearingPressure = tool.execute;
export default tool;
