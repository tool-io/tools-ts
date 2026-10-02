import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly restStart: number;
  readonly restEnd: number;
  readonly availableStart: number;
  readonly availableEnd: number;
};
export type Output = {
  readonly overlap: number;
  readonly restFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    restStart: { type: "number" },
    restEnd: { type: "number" },
    availableStart: { type: "number" },
    availableEnd: { type: "number" },
  },
  required: ["restStart", "restEnd", "availableStart", "availableEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "number" },
    restFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["overlap", "restFraction", "defined"],
} as const;
/** Calculate performer rest window overlap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { restStart, restEnd, availableStart, availableEnd } = request;
  const compute = (): Output => {
    H.domain(restEnd >= restStart && availableEnd >= availableStart);
    return {
      overlap: Math.max(
        0,
        Math.min(restEnd, availableEnd) - Math.max(restStart, availableStart),
      ),
      restFraction:
        restEnd > restStart
          ? Math.max(
              0,
              Math.min(restEnd, availableEnd) -
                Math.max(restStart, availableStart),
            ) /
            (restEnd - restStart)
          : 0,
      defined: restEnd > restStart,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { restStart: 10, restEnd: 20, availableStart: 15, availableEnd: 25 },
  output: { overlap: 5, restFraction: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const performerRestWindowOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/performer-rest-window-overlap",
    title: "Performer Rest Window Overlap Tool",
    description:
      "Calculate performer rest window overlap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        restStart: { type: "number" },
        restEnd: { type: "number" },
        availableStart: { type: "number" },
        availableEnd: { type: "number" },
      },
      required: ["restStart", "restEnd", "availableStart", "availableEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "number" },
        restFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["overlap", "restFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "restStart",
          label: "Rest Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "restEnd",
          label: "Rest End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableStart",
          label: "Available Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableEnd",
          label: "Available End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        {
          id: "restFraction",
          label: "Rest Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = performerRestWindowOverlapTool.execute;
export default performerRestWindowOverlapTool;
