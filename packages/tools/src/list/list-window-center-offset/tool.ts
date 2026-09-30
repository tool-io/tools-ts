import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startIndex: number;
  readonly windowLength: number;
  readonly referenceIndex: number;
};
export type Output = { readonly centerIndex: number; readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startIndex: { type: "integer", minimum: 0 },
    windowLength: { type: "integer", minimum: 1 },
    referenceIndex: { type: "number" },
  },
  required: ["startIndex", "windowLength", "referenceIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { centerIndex: { type: "number" }, offset: { type: "number" } },
  required: ["centerIndex", "offset"],
} as const;
/** Calculate list window center offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startIndex, windowLength, referenceIndex } = request;
  const compute = (): Output => {
    H.integer(startIndex, 0);
    H.integer(windowLength, 1);
    return {
      centerIndex: startIndex + (windowLength - 1) / 2,
      offset: startIndex + (windowLength - 1) / 2 - referenceIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startIndex: 3, windowLength: 4, referenceIndex: 3 },
  output: { centerIndex: 4.5, offset: 1.5 },
} satisfies ToolExample<Input, Output>;
export const listWindowCenterOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-window-center-offset",
    title: "List Window Center Offset Tool",
    description:
      "Calculate list window center offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startIndex: { type: "integer", minimum: 0 },
        windowLength: { type: "integer", minimum: 1 },
        referenceIndex: { type: "number" },
      },
      required: ["startIndex", "windowLength", "referenceIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerIndex: { type: "number" },
        offset: { type: "number" },
      },
      required: ["centerIndex", "offset"],
    },
    ports: {
      inputs: [
        {
          id: "startIndex",
          label: "Start Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowLength",
          label: "Window Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceIndex",
          label: "Reference Index",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "centerIndex",
          label: "Center Index",
          valueType: { type: "number" },
        },
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = listWindowCenterOffsetTool.execute;
export default listWindowCenterOffsetTool;
