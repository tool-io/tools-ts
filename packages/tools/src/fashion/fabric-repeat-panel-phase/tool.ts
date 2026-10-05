import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panelStart: number;
  readonly repeatLength: number;
  readonly referenceStart: number;
};
export type Output = {
  readonly phase: number;
  readonly advanceToNextRepeat: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panelStart: { type: "number" },
    repeatLength: { type: "number", exclusiveMinimum: 0 },
    referenceStart: { type: "number" },
  },
  required: ["panelStart", "repeatLength", "referenceStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phase: { type: "number" },
    advanceToNextRepeat: { type: "number" },
  },
  required: ["phase", "advanceToNextRepeat"],
} as const;
/** Find a panel-start phase and the nonnegative advance needed to align with a fabric repeat. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { panelStart, repeatLength, referenceStart } = request;
  const compute = (): Output => {
    (H.domain(repeatLength > 0, "repeatLength"), repeatLength);
    const r =
        ((panelStart % repeatLength) - (referenceStart % repeatLength)) %
        repeatLength,
      phase = r < 0 ? r + repeatLength : r;
    return {
      phase,
      advanceToNextRepeat: phase === 0 ? 0 : repeatLength - phase,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { panelStart: 35, repeatLength: 12, referenceStart: 0 },
  output: { phase: 11, advanceToNextRepeat: 1 },
} satisfies ToolExample<Input, Output>;
export const fabricRepeatPanelPhaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/fabric-repeat-panel-phase",
    title: "Fabric Repeat Panel Phase Tool",
    description:
      "Find a panel-start phase and the nonnegative advance needed to align with a fabric repeat.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panelStart: { type: "number" },
        repeatLength: { type: "number", exclusiveMinimum: 0 },
        referenceStart: { type: "number" },
      },
      required: ["panelStart", "repeatLength", "referenceStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phase: { type: "number" },
        advanceToNextRepeat: { type: "number" },
      },
      required: ["phase", "advanceToNextRepeat"],
    },
    ports: {
      inputs: [
        {
          id: "panelStart",
          label: "Panel Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repeatLength",
          label: "Repeat Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceStart",
          label: "Reference Start",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "phase", label: "Phase", valueType: { type: "number" } },
        {
          id: "advanceToNextRepeat",
          label: "Advance To Next Repeat",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fabricRepeatPanelPhaseTool.execute;
export default fabricRepeatPanelPhaseTool;
