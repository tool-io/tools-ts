import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startSize: number;
  readonly endSize: number;
  readonly length: number;
  readonly suppliedSizeUnitFactor: number;
};
export type Output = {
  readonly convertedStart: number;
  readonly convertedEnd: number;
  readonly slope: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startSize: { type: "number", minimum: 0 },
    endSize: { type: "number", minimum: 0 },
    length: { type: "number", exclusiveMinimum: 0 },
    suppliedSizeUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["startSize", "endSize", "length", "suppliedSizeUnitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedStart: { type: "number" },
    convertedEnd: { type: "number" },
    slope: { type: "number" },
  },
  required: ["convertedStart", "convertedEnd", "slope"],
} as const;
/** Unit-aware linear taper arithmetic from supplied bench dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startSize, endSize, length, suppliedSizeUnitFactor } = request;
  const compute = (): Output => {
    H.positive(length);
    H.positive(suppliedSizeUnitFactor);
    H.domain(startSize >= 0 && endSize >= 0);
    return {
      convertedStart: startSize * suppliedSizeUnitFactor,
      convertedEnd: endSize * suppliedSizeUnitFactor,
      slope: ((endSize - startSize) * suppliedSizeUnitFactor) / length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startSize: 10, endSize: 20, length: 5, suppliedSizeUnitFactor: 0.1 },
  output: { convertedStart: 1, convertedEnd: 2, slope: 0.2 },
} satisfies ToolExample<Input, Output>;
export const wireTaperSizeUnitFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/wire-taper-size-unit-flag",
    title: "Wire Taper Size Unit Flag Tool",
    description:
      "Unit-aware linear taper arithmetic from supplied bench dimensions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startSize: { type: "number", minimum: 0 },
        endSize: { type: "number", minimum: 0 },
        length: { type: "number", exclusiveMinimum: 0 },
        suppliedSizeUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["startSize", "endSize", "length", "suppliedSizeUnitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedStart: { type: "number" },
        convertedEnd: { type: "number" },
        slope: { type: "number" },
      },
      required: ["convertedStart", "convertedEnd", "slope"],
    },
    ports: {
      inputs: [
        {
          id: "startSize",
          label: "Start Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endSize",
          label: "End Size",
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
          id: "suppliedSizeUnitFactor",
          label: "Supplied Size Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedStart",
          label: "Converted Start",
          valueType: { type: "number" },
        },
        {
          id: "convertedEnd",
          label: "Converted End",
          valueType: { type: "number" },
        },
        { id: "slope", label: "Slope", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = wireTaperSizeUnitFlagTool.execute;
export default wireTaperSizeUnitFlagTool;
