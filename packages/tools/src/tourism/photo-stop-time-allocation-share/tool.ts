import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly photoStopMinutes: number;
  readonly totalTourMinutes: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    photoStopMinutes: { type: "number", minimum: 0 },
    totalTourMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["photoStopMinutes", "totalTourMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicit photo-stop duration to compatible total tour duration without choosing an itinerary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { photoStopMinutes, totalTourMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalTourMinutes) && totalTourMinutes > 0,
      "totalTourMinutes",
    ),
      totalTourMinutes);
    H.domain(
      photoStopMinutes >= 0 && photoStopMinutes <= totalTourMinutes,
      "photoStopMinutes",
    );
    return {
      fraction: photoStopMinutes / totalTourMinutes,
      remainder: totalTourMinutes - photoStopMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { photoStopMinutes: 30, totalTourMinutes: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const photoStopTimeAllocationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["tourism", "business and finance"],
      keywords: ["tourism", "business and finance"],
    },
    id: "tourism/photo-stop-time-allocation-share",
    title: "Photo Stop Time Allocation Share",
    description:
      "Normalize explicit photo-stop duration to compatible total tour duration without choosing an itinerary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        photoStopMinutes: { type: "number", minimum: 0 },
        totalTourMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["photoStopMinutes", "totalTourMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "photoStopMinutes",
          label: "Photo Stop Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalTourMinutes",
          label: "Total Tour Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = photoStopTimeAllocationShareTool.execute;
export default photoStopTimeAllocationShareTool;
