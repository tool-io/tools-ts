import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly walkMinutes: number;
  readonly suppliedRestMinutes: number;
  readonly availableMinutes: number;
};
export type Output = {
  readonly requiredMinutes: number;
  readonly remainingMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    walkMinutes: { type: "number", minimum: 0 },
    suppliedRestMinutes: { type: "number", minimum: 0 },
    availableMinutes: { type: "number", minimum: 0 },
  },
  required: ["walkMinutes", "suppliedRestMinutes", "availableMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredMinutes: { type: "number" },
    remainingMinutes: { type: "number" },
  },
  required: ["requiredMinutes", "remainingMinutes"],
} as const;
/** Compare explicit walking-leg plus supplied rest duration with available time without estimating walking ability or route safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { walkMinutes, suppliedRestMinutes, availableMinutes } = request;
  const compute = (): Output => {
    H.domain(
      walkMinutes >= 0 && suppliedRestMinutes >= 0 && availableMinutes >= 0,
      "walkMinutes",
    );
    return {
      requiredMinutes: walkMinutes + suppliedRestMinutes,
      remainingMinutes: availableMinutes - walkMinutes - suppliedRestMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { walkMinutes: 40, suppliedRestMinutes: 10, availableMinutes: 60 },
  output: { requiredMinutes: 50, remainingMinutes: 10 },
} satisfies ToolExample<Input, Output>;
export const walkingTourSingleLegRestBufferTool = H.defineSchemaCalculation<
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
    id: "tourism/walking-tour-single-leg-rest-buffer",
    title: "Walking Tour Single Leg Rest Buffer",
    description:
      "Compare explicit walking-leg plus supplied rest duration with available time without estimating walking ability or route safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        walkMinutes: { type: "number", minimum: 0 },
        suppliedRestMinutes: { type: "number", minimum: 0 },
        availableMinutes: { type: "number", minimum: 0 },
      },
      required: ["walkMinutes", "suppliedRestMinutes", "availableMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredMinutes: { type: "number" },
        remainingMinutes: { type: "number" },
      },
      required: ["requiredMinutes", "remainingMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "walkMinutes",
          label: "Walk Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRestMinutes",
          label: "Supplied Rest Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableMinutes",
          label: "Available Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredMinutes",
          label: "Required Minutes",
          valueType: { type: "number" },
        },
        {
          id: "remainingMinutes",
          label: "Remaining Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = walkingTourSingleLegRestBufferTool.execute;
export default walkingTourSingleLegRestBufferTool;
