import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionMinutes: number;
  readonly interpretedMinutes: number;
  readonly concurrentMinutes: number;
};
export type Output = {
  readonly uniquePersonMinutes: number;
  readonly interpretedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionMinutes: { type: "number", exclusiveMinimum: 0 },
    interpretedMinutes: { type: "number", minimum: 0 },
    concurrentMinutes: { type: "number", minimum: 0 },
  },
  required: ["sessionMinutes", "interpretedMinutes", "concurrentMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniquePersonMinutes: { type: "number" },
    interpretedShare: { type: "number" },
  },
  required: ["uniquePersonMinutes", "interpretedShare"],
} as const;
/** Calculate extension interpreter contact minute share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionMinutes, interpretedMinutes, concurrentMinutes } = request;
  const compute = (): Output => {
    H.positive(sessionMinutes);
    H.domain(
      interpretedMinutes >= 0 &&
        interpretedMinutes <= sessionMinutes &&
        concurrentMinutes >= 0 &&
        concurrentMinutes <= interpretedMinutes,
    );
    return {
      uniquePersonMinutes:
        sessionMinutes + interpretedMinutes - concurrentMinutes,
      interpretedShare: interpretedMinutes / sessionMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sessionMinutes: 60, interpretedMinutes: 30, concurrentMinutes: 20 },
  output: { uniquePersonMinutes: 70, interpretedShare: 0.5 },
} satisfies ToolExample<Input, Output>;
export const extensionInterpreterContactMinuteShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-extension/extension-interpreter-contact-minute-share",
      title: "Extension Interpreter Contact Minute Share Tool",
      description:
        "Calculate extension interpreter contact minute share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sessionMinutes: { type: "number", exclusiveMinimum: 0 },
          interpretedMinutes: { type: "number", minimum: 0 },
          concurrentMinutes: { type: "number", minimum: 0 },
        },
        required: ["sessionMinutes", "interpretedMinutes", "concurrentMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uniquePersonMinutes: { type: "number" },
          interpretedShare: { type: "number" },
        },
        required: ["uniquePersonMinutes", "interpretedShare"],
      },
      ports: {
        inputs: [
          {
            id: "sessionMinutes",
            label: "Session Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interpretedMinutes",
            label: "Interpreted Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "concurrentMinutes",
            label: "Concurrent Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "uniquePersonMinutes",
            label: "Unique Person Minutes",
            valueType: { type: "number" },
          },
          {
            id: "interpretedShare",
            label: "Interpreted Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = extensionInterpreterContactMinuteShareTool.execute;
export default extensionInterpreterContactMinuteShareTool;
