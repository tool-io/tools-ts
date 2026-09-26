import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDiameter: number;
  readonly secondDiameter: number;
  readonly length: number;
  readonly targetTaper: number;
};
export type Output = {
  readonly measuredTaper: number;
  readonly taperGap: number;
  readonly targetEndDiameter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDiameter: { type: "number", minimum: 0 },
    secondDiameter: { type: "number", minimum: 0 },
    length: { type: "number", exclusiveMinimum: 0 },
    targetTaper: { type: "number" },
  },
  required: ["firstDiameter", "secondDiameter", "length", "targetTaper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredTaper: { type: "number" },
    taperGap: { type: "number" },
    targetEndDiameter: { type: "number" },
  },
  required: ["measuredTaper", "taperGap", "targetEndDiameter"],
} as const;
/** Calculate canal model conicity length gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDiameter, secondDiameter, length, targetTaper } = request;
  const compute = (): Output => {
    H.positive(length);
    H.domain(firstDiameter >= 0 && secondDiameter >= 0);
    return {
      measuredTaper: (secondDiameter - firstDiameter) / length,
      taperGap: (secondDiameter - firstDiameter) / length - targetTaper,
      targetEndDiameter: firstDiameter + targetTaper * length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstDiameter: 0.2,
    secondDiameter: 0.8,
    length: 10,
    targetTaper: 0.04,
  },
  output: {
    measuredTaper: 0.06000000000000001,
    taperGap: 0.02000000000000001,
    targetEndDiameter: 0.6000000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const canalModelConicityLengthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/canal-model-conicity-length-gap",
    title: "Canal Model Conicity Length Gap Tool",
    description:
      "Calculate canal model conicity length gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDiameter: { type: "number", minimum: 0 },
        secondDiameter: { type: "number", minimum: 0 },
        length: { type: "number", exclusiveMinimum: 0 },
        targetTaper: { type: "number" },
      },
      required: ["firstDiameter", "secondDiameter", "length", "targetTaper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredTaper: { type: "number" },
        taperGap: { type: "number" },
        targetEndDiameter: { type: "number" },
      },
      required: ["measuredTaper", "taperGap", "targetEndDiameter"],
    },
    ports: {
      inputs: [
        {
          id: "firstDiameter",
          label: "First Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDiameter",
          label: "Second Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetTaper",
          label: "Target Taper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "measuredTaper",
          label: "Measured Taper",
          valueType: { type: "number" },
        },
        { id: "taperGap", label: "Taper Gap", valueType: { type: "number" } },
        {
          id: "targetEndDiameter",
          label: "Target End Diameter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = canalModelConicityLengthGapTool.execute;
export default canalModelConicityLengthGapTool;
