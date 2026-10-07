import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEventEndSeconds: number;
  readonly currentEventStartSeconds: number;
  readonly minimumGapSeconds: number;
};
export type Output = {
  readonly gapSeconds: number;
  readonly independentUnderSuppliedRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEventEndSeconds: { type: "number" },
    currentEventStartSeconds: { type: "number" },
    minimumGapSeconds: { type: "number", minimum: 0 },
  },
  required: [
    "previousEventEndSeconds",
    "currentEventStartSeconds",
    "minimumGapSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapSeconds: { type: "number" },
    independentUnderSuppliedRule: { type: "boolean" },
  },
  required: ["gapSeconds", "independentUnderSuppliedRule"],
} as const;
/** Apply a caller-supplied inclusive gap rule to a camera-trap event pair without inferring biological independence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    previousEventEndSeconds,
    currentEventStartSeconds,
    minimumGapSeconds,
  } = request;
  const compute = (): Output => {
    H.domain(minimumGapSeconds >= 0, "minimumGapSeconds");
    return {
      gapSeconds: currentEventStartSeconds - previousEventEndSeconds,
      independentUnderSuppliedRule:
        currentEventStartSeconds - previousEventEndSeconds >= minimumGapSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousEventEndSeconds: 100,
    currentEventStartSeconds: 160,
    minimumGapSeconds: 60,
  },
  output: { gapSeconds: 60, independentUnderSuppliedRule: true },
} satisfies ToolExample<Input, Output>;
export const cameraTrapSingleIndependentEventGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["conservation-biology", "conservation biology", "biology"],
        keywords: ["conservation biology", "biology"],
      },
      id: "conservation-biology/camera-trap-single-independent-event-gap",
      title: "Camera Trap Single Independent Event Gap",
      description:
        "Apply a caller-supplied inclusive gap rule to a camera-trap event pair without inferring biological independence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          previousEventEndSeconds: { type: "number" },
          currentEventStartSeconds: { type: "number" },
          minimumGapSeconds: { type: "number", minimum: 0 },
        },
        required: [
          "previousEventEndSeconds",
          "currentEventStartSeconds",
          "minimumGapSeconds",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gapSeconds: { type: "number" },
          independentUnderSuppliedRule: { type: "boolean" },
        },
        required: ["gapSeconds", "independentUnderSuppliedRule"],
      },
      ports: {
        inputs: [
          {
            id: "previousEventEndSeconds",
            label: "Previous Event End Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "currentEventStartSeconds",
            label: "Current Event Start Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimumGapSeconds",
            label: "Minimum Gap Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "gapSeconds",
            label: "Gap Seconds",
            valueType: { type: "number" },
          },
          {
            id: "independentUnderSuppliedRule",
            label: "Independent Under Supplied Rule",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cameraTrapSingleIndependentEventGapTool.execute;
export default cameraTrapSingleIndependentEventGapTool;
