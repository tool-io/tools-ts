import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cueTime: number;
  readonly referenceCueTime: number;
  readonly suppliedOffset: number;
};
export type Output = { readonly relativeTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cueTime: { type: "number" },
    referenceCueTime: { type: "number" },
    suppliedOffset: { type: "number" },
  },
  required: ["cueTime", "referenceCueTime", "suppliedOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeTime: { type: "number" } },
  required: ["relativeTime"],
} as const;
/** Calculate cue relative time offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cueTime, referenceCueTime, suppliedOffset } = request;
  const compute = (): Output => {
    return { relativeTime: cueTime - referenceCueTime + suppliedOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cueTime: 50, referenceCueTime: 20, suppliedOffset: -5 },
  output: { relativeTime: 25 },
} satisfies ToolExample<Input, Output>;
export const cueRelativeTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/cue-relative-time-offset",
    title: "Cue Relative Time Offset Tool",
    description:
      "Calculate cue relative time offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cueTime: { type: "number" },
        referenceCueTime: { type: "number" },
        suppliedOffset: { type: "number" },
      },
      required: ["cueTime", "referenceCueTime", "suppliedOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeTime: { type: "number" } },
      required: ["relativeTime"],
    },
    ports: {
      inputs: [
        {
          id: "cueTime",
          label: "Cue Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceCueTime",
          label: "Reference Cue Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOffset",
          label: "Supplied Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeTime",
          label: "Relative Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cueRelativeTimeOffsetTool.execute;
export default cueRelativeTimeOffsetTool;
