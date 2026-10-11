import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedValue: number;
  readonly inputUnit: string;
};
export type Output = {
  readonly milligramsPerGram: number;
  readonly percentByMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedValue: { type: "number", minimum: 0 },
    inputUnit: { type: "string", maxLength: 8192, enum: ["percent", "mg/g"] },
  },
  required: ["recordedValue", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    milligramsPerGram: { type: "number" },
    percentByMass: { type: "number" },
  },
  required: ["milligramsPerGram", "percentByMass"],
} as const;
/** Convert an explicit marker mass fraction between percent and milligrams per gram without interpreting product quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedValue, inputUnit } = request;
  const compute = (): Output => {
    H.domain(recordedValue >= 0, "recordedValue");
    H.domain(["percent", "mg/g"].includes(inputUnit), "inputUnit");
    H.domain(
      recordedValue <= (inputUnit === "percent" ? 100 : 1000),
      "recordedValue",
    );
    return {
      milligramsPerGram:
        inputUnit === "percent" ? recordedValue * 10 : recordedValue,
      percentByMass: inputUnit === "mg/g" ? recordedValue / 10 : recordedValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedValue: 2, inputUnit: "percent" },
  output: { milligramsPerGram: 20, percentByMass: 2 },
} satisfies ToolExample<Input, Output>;
export const pharmacognosyMarkerUnitCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacognosy", "pharmacy"],
      keywords: ["pharmacognosy", "pharmacy"],
    },
    id: "pharmacognosy/pharmacognosy-marker-unit-crosswalk",
    title: "Pharmacognosy Marker Unit Crosswalk",
    description:
      "Convert an explicit marker mass fraction between percent and milligrams per gram without interpreting product quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedValue: { type: "number", minimum: 0 },
        inputUnit: {
          type: "string",
          maxLength: 8192,
          enum: ["percent", "mg/g"],
        },
      },
      required: ["recordedValue", "inputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        milligramsPerGram: { type: "number" },
        percentByMass: { type: "number" },
      },
      required: ["milligramsPerGram", "percentByMass"],
    },
    ports: {
      inputs: [
        {
          id: "recordedValue",
          label: "Recorded Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputUnit",
          label: "Input Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "milligramsPerGram",
          label: "Milligrams Per Gram",
          valueType: { type: "number" },
        },
        {
          id: "percentByMass",
          label: "Percent By Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacognosyMarkerUnitCrosswalkTool.execute;
export default pharmacognosyMarkerUnitCrosswalkTool;
