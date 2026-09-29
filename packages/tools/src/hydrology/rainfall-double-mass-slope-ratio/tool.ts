import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeStationIncrement: number;
  readonly beforeReferenceIncrement: number;
  readonly afterStationIncrement: number;
  readonly afterReferenceIncrement: number;
};
export type Output = {
  readonly slopeBefore: number;
  readonly slopeAfter: number;
  readonly correctionFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeStationIncrement: { type: "number", minimum: 0 },
    beforeReferenceIncrement: { type: "number", exclusiveMinimum: 0 },
    afterStationIncrement: { type: "number", exclusiveMinimum: 0 },
    afterReferenceIncrement: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "beforeStationIncrement",
    "beforeReferenceIncrement",
    "afterStationIncrement",
    "afterReferenceIncrement",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slopeBefore: { type: "number" },
    slopeAfter: { type: "number" },
    correctionFactor: { type: "number" },
  },
  required: ["slopeBefore", "slopeAfter", "correctionFactor"],
} as const;
/** Calculate rainfall double mass slope ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    beforeStationIncrement,
    beforeReferenceIncrement,
    afterStationIncrement,
    afterReferenceIncrement,
  } = request;
  const compute = (): Output => {
    H.positive(beforeReferenceIncrement);
    H.positive(afterReferenceIncrement);
    H.positive(afterStationIncrement);
    H.domain(beforeStationIncrement >= 0);
    return {
      slopeBefore: beforeStationIncrement / beforeReferenceIncrement,
      slopeAfter: afterStationIncrement / afterReferenceIncrement,
      correctionFactor:
        beforeStationIncrement /
        beforeReferenceIncrement /
        (afterStationIncrement / afterReferenceIncrement),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    beforeStationIncrement: 80,
    beforeReferenceIncrement: 100,
    afterStationIncrement: 60,
    afterReferenceIncrement: 100,
  },
  output: {
    slopeBefore: 0.8,
    slopeAfter: 0.6,
    correctionFactor: 1.3333333333333335,
  },
} satisfies ToolExample<Input, Output>;
export const rainfallDoubleMassSlopeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/rainfall-double-mass-slope-ratio",
    title: "Rainfall Double Mass Slope Ratio Tool",
    description:
      "Calculate rainfall double mass slope ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeStationIncrement: { type: "number", minimum: 0 },
        beforeReferenceIncrement: { type: "number", exclusiveMinimum: 0 },
        afterStationIncrement: { type: "number", exclusiveMinimum: 0 },
        afterReferenceIncrement: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "beforeStationIncrement",
        "beforeReferenceIncrement",
        "afterStationIncrement",
        "afterReferenceIncrement",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slopeBefore: { type: "number" },
        slopeAfter: { type: "number" },
        correctionFactor: { type: "number" },
      },
      required: ["slopeBefore", "slopeAfter", "correctionFactor"],
    },
    ports: {
      inputs: [
        {
          id: "beforeStationIncrement",
          label: "Before Station Increment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beforeReferenceIncrement",
          label: "Before Reference Increment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterStationIncrement",
          label: "After Station Increment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterReferenceIncrement",
          label: "After Reference Increment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "slopeBefore",
          label: "Slope Before",
          valueType: { type: "number" },
        },
        {
          id: "slopeAfter",
          label: "Slope After",
          valueType: { type: "number" },
        },
        {
          id: "correctionFactor",
          label: "Correction Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainfallDoubleMassSlopeRatioTool.execute;
export default rainfallDoubleMassSlopeRatioTool;
