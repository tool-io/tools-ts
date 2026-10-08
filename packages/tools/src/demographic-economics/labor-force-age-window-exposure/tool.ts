import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageStart: number;
  readonly ageEnd: number;
  readonly windowLower: number;
  readonly windowUpper: number;
};
export type Output = { readonly ageWindowExposure: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageStart: { type: "number" },
    ageEnd: { type: "number" },
    windowLower: { type: "number" },
    windowUpper: { type: "number" },
  },
  required: ["ageStart", "ageEnd", "windowLower", "windowUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ageWindowExposure: { type: "number" } },
  required: ["ageWindowExposure"],
} as const;
/** Calculate overlap of an explicit attained-age interval with a supplied half-open labor-force age window without defining working age. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageStart, ageEnd, windowLower, windowUpper } = request;
  const compute = (): Output => {
    H.domain(ageEnd >= ageStart, "ageEnd");
    H.domain(windowUpper >= windowLower, "windowUpper");
    return {
      ageWindowExposure: Math.max(
        0,
        Math.min(ageEnd, windowUpper) - Math.max(ageStart, windowLower),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ageStart: 15, ageEnd: 25, windowLower: 18, windowUpper: 65 },
  output: { ageWindowExposure: 7 },
} satisfies ToolExample<Input, Output>;
export const laborForceAgeWindowExposureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/labor-force-age-window-exposure",
    title: "Labor Force Age Window Exposure Tool",
    description:
      "Calculate overlap of an explicit attained-age interval with a supplied half-open labor-force age window without defining working age.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageStart: { type: "number" },
        ageEnd: { type: "number" },
        windowLower: { type: "number" },
        windowUpper: { type: "number" },
      },
      required: ["ageStart", "ageEnd", "windowLower", "windowUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ageWindowExposure: { type: "number" } },
      required: ["ageWindowExposure"],
    },
    ports: {
      inputs: [
        {
          id: "ageStart",
          label: "Age Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ageEnd",
          label: "Age End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowLower",
          label: "Window Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowUpper",
          label: "Window Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ageWindowExposure",
          label: "Age Window Exposure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = laborForceAgeWindowExposureTool.execute;
export default laborForceAgeWindowExposureTool;
