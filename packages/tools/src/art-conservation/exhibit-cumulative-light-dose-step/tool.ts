import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingLuxHours: number;
  readonly illuminanceLux: number;
  readonly exposureHours: number;
};
export type Output = {
  readonly closingLuxHours: number;
  readonly addedLuxHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingLuxHours: { type: "number", minimum: 0 },
    illuminanceLux: { type: "number", minimum: 0 },
    exposureHours: { type: "number", minimum: 0 },
  },
  required: ["openingLuxHours", "illuminanceLux", "exposureHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closingLuxHours: { type: "number" },
    addedLuxHours: { type: "number" },
  },
  required: ["closingLuxHours", "addedLuxHours"],
} as const;
/** Accumulate supplied constant illuminance times duration as lux-hours without selecting conservation exposure limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingLuxHours, illuminanceLux, exposureHours } = request;
  const compute = (): Output => {
    H.domain(openingLuxHours >= 0, "openingLuxHours");
    H.domain(illuminanceLux >= 0, "illuminanceLux");
    H.domain(exposureHours >= 0, "exposureHours");
    return {
      closingLuxHours: openingLuxHours + illuminanceLux * exposureHours,
      addedLuxHours: illuminanceLux * exposureHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingLuxHours: 1000, illuminanceLux: 50, exposureHours: 8 },
  output: { closingLuxHours: 1400, addedLuxHours: 400 },
} satisfies ToolExample<Input, Output>;
export const exhibitCumulativeLightDoseStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/exhibit-cumulative-light-dose-step",
    title: "Exhibit Cumulative Light Dose Step",
    description:
      "Accumulate supplied constant illuminance times duration as lux-hours without selecting conservation exposure limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingLuxHours: { type: "number", minimum: 0 },
        illuminanceLux: { type: "number", minimum: 0 },
        exposureHours: { type: "number", minimum: 0 },
      },
      required: ["openingLuxHours", "illuminanceLux", "exposureHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closingLuxHours: { type: "number" },
        addedLuxHours: { type: "number" },
      },
      required: ["closingLuxHours", "addedLuxHours"],
    },
    ports: {
      inputs: [
        {
          id: "openingLuxHours",
          label: "Opening Lux Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "illuminanceLux",
          label: "Illuminance Lux",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposureHours",
          label: "Exposure Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingLuxHours",
          label: "Closing Lux Hours",
          valueType: { type: "number" },
        },
        {
          id: "addedLuxHours",
          label: "Added Lux Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exhibitCumulativeLightDoseStepTool.execute;
export default exhibitCumulativeLightDoseStepTool;
