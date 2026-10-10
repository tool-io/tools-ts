import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEndHours: number;
  readonly nextStartHours: number;
  readonly suppliedSeparationHours: number;
};
export type Output = {
  readonly gapHours: number;
  readonly separateUnderRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEndHours: { type: "number" },
    nextStartHours: { type: "number" },
    suppliedSeparationHours: { type: "number", minimum: 0 },
  },
  required: ["previousEndHours", "nextStartHours", "suppliedSeparationHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapHours: { type: "number" },
    separateUnderRule: { type: "boolean" },
  },
  required: ["gapHours", "separateUnderRule"],
} as const;
/** Compare a supplied dry interval with an explicit inclusive storm-separation rule without selecting a storm definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEndHours, nextStartHours, suppliedSeparationHours } = request;
  const compute = (): Output => {
    H.domain(
      nextStartHours >= previousEndHours && suppliedSeparationHours >= 0,
      "nextStartHours",
    );
    return {
      gapHours: nextStartHours - previousEndHours,
      separateUnderRule:
        nextStartHours - previousEndHours >= suppliedSeparationHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousEndHours: 10,
    nextStartHours: 18,
    suppliedSeparationHours: 6,
  },
  output: { gapHours: 8, separateUnderRule: true },
} satisfies ToolExample<Input, Output>;
export const stormInterEventGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["hydrometeorology", "earth and environmental sciences"],
      keywords: ["hydrometeorology", "earth and environmental sciences"],
    },
    id: "hydrometeorology/storm-inter-event-gap",
    title: "Storm Inter Event Gap",
    description:
      "Compare a supplied dry interval with an explicit inclusive storm-separation rule without selecting a storm definition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousEndHours: { type: "number" },
        nextStartHours: { type: "number" },
        suppliedSeparationHours: { type: "number", minimum: 0 },
      },
      required: [
        "previousEndHours",
        "nextStartHours",
        "suppliedSeparationHours",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapHours: { type: "number" },
        separateUnderRule: { type: "boolean" },
      },
      required: ["gapHours", "separateUnderRule"],
    },
    ports: {
      inputs: [
        {
          id: "previousEndHours",
          label: "Previous End Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextStartHours",
          label: "Next Start Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSeparationHours",
          label: "Supplied Separation Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gapHours", label: "Gap Hours", valueType: { type: "number" } },
        {
          id: "separateUnderRule",
          label: "Separate Under Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = stormInterEventGapTool.execute;
export default stormInterEventGapTool;
