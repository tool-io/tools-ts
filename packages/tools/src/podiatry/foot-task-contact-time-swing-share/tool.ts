import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactSeconds: number;
  readonly swingSeconds: number;
  readonly doubleContactSeconds: number;
};
export type Output = {
  readonly cycleSeconds: number;
  readonly dutyFraction: number;
  readonly exclusiveContactSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactSeconds: { type: "number", minimum: 0 },
    swingSeconds: { type: "number", minimum: 0 },
    doubleContactSeconds: { type: "number", minimum: 0 },
  },
  required: ["contactSeconds", "swingSeconds", "doubleContactSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleSeconds: { type: "number" },
    dutyFraction: { type: "number" },
    exclusiveContactSeconds: { type: "number" },
  },
  required: ["cycleSeconds", "dutyFraction", "exclusiveContactSeconds"],
} as const;
/** Calculate foot task contact time swing share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactSeconds, swingSeconds, doubleContactSeconds } = request;
  const compute = (): Output => {
    H.domain(
      contactSeconds >= 0 &&
        swingSeconds >= 0 &&
        contactSeconds + swingSeconds > 0 &&
        doubleContactSeconds >= 0 &&
        doubleContactSeconds <= contactSeconds,
    );
    return {
      cycleSeconds: contactSeconds + swingSeconds,
      dutyFraction: contactSeconds / (contactSeconds + swingSeconds),
      exclusiveContactSeconds: contactSeconds - doubleContactSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactSeconds: 0.6, swingSeconds: 0.4, doubleContactSeconds: 0.1 },
  output: { cycleSeconds: 1, dutyFraction: 0.6, exclusiveContactSeconds: 0.5 },
} satisfies ToolExample<Input, Output>;
export const footTaskContactTimeSwingShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/foot-task-contact-time-swing-share",
    title: "Foot Task Contact Time Swing Share Tool",
    description:
      "Calculate foot task contact time swing share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactSeconds: { type: "number", minimum: 0 },
        swingSeconds: { type: "number", minimum: 0 },
        doubleContactSeconds: { type: "number", minimum: 0 },
      },
      required: ["contactSeconds", "swingSeconds", "doubleContactSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleSeconds: { type: "number" },
        dutyFraction: { type: "number" },
        exclusiveContactSeconds: { type: "number" },
      },
      required: ["cycleSeconds", "dutyFraction", "exclusiveContactSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "contactSeconds",
          label: "Contact Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "swingSeconds",
          label: "Swing Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "doubleContactSeconds",
          label: "Double Contact Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cycleSeconds",
          label: "Cycle Seconds",
          valueType: { type: "number" },
        },
        {
          id: "dutyFraction",
          label: "Duty Fraction",
          valueType: { type: "number" },
        },
        {
          id: "exclusiveContactSeconds",
          label: "Exclusive Contact Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = footTaskContactTimeSwingShareTool.execute;
export default footTaskContactTimeSwingShareTool;
