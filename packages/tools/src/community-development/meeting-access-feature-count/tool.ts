import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly required: readonly string[];
  readonly available: readonly string[];
};
export type Output = {
  readonly providedCount: number;
  readonly missingCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    available: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["required", "available"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    providedCount: { type: "integer" },
    missingCount: { type: "integer" },
  },
  required: ["providedCount", "missingCount"],
} as const;
/** Calculate meeting access feature count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { required, available } = request;
  const compute = (): Output => {
    return {
      providedCount: new Set(required.filter((x) => available.includes(x)))
        .size,
      missingCount: new Set(required.filter((x) => !available.includes(x)))
        .size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { required: ["caption", "ramp"], available: ["ramp"] },
  output: { providedCount: 1, missingCount: 1 },
} satisfies ToolExample<Input, Output>;
export const meetingAccessFeatureCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/meeting-access-feature-count",
    title: "Meeting Access Feature Count Tool",
    description:
      "Calculate meeting access feature count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        available: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["required", "available"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        providedCount: { type: "integer" },
        missingCount: { type: "integer" },
      },
      required: ["providedCount", "missingCount"],
    },
    ports: {
      inputs: [
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "available",
          label: "Available",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "providedCount",
          label: "Provided Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingCount",
          label: "Missing Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = meetingAccessFeatureCountTool.execute;
export default meetingAccessFeatureCountTool;
