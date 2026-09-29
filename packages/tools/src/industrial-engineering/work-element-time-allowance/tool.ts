import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basicTime: number;
  readonly allowanceFraction: number;
  readonly basedOnTotalTime: boolean;
};
export type Output = { readonly allowedTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basicTime: { type: "number" },
    allowanceFraction: { type: "number" },
    basedOnTotalTime: { type: "boolean" },
  },
  required: ["basicTime", "allowanceFraction", "basedOnTotalTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allowedTime: { type: "number" } },
  required: ["allowedTime"],
} as const;
/** Apply an explicit allowance as a share of basic or total time; the two conventions are distinct. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basicTime, allowanceFraction, basedOnTotalTime } = request;
  const compute = (): Output => {
    H.domain(
      basicTime >= 0 &&
        allowanceFraction >= 0 &&
        (!basedOnTotalTime || allowanceFraction < 1),
    );
    return {
      allowedTime: basedOnTotalTime
        ? basicTime / (1 - allowanceFraction)
        : basicTime * (1 + allowanceFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { basicTime: 10, allowanceFraction: 0.2, basedOnTotalTime: true },
  output: { allowedTime: 12.5 },
} satisfies ToolExample<Input, Output>;
export const workElementTimeAllowanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/work-element-time-allowance",
    title: "Work Element Time Allowance Tool",
    description:
      "Apply an explicit allowance as a share of basic or total time; the two conventions are distinct.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basicTime: { type: "number" },
        allowanceFraction: { type: "number" },
        basedOnTotalTime: { type: "boolean" },
      },
      required: ["basicTime", "allowanceFraction", "basedOnTotalTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { allowedTime: { type: "number" } },
      required: ["allowedTime"],
    },
    ports: {
      inputs: [
        {
          id: "basicTime",
          label: "Basic Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowanceFraction",
          label: "Allowance Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basedOnTotalTime",
          label: "Based On Total Time",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "allowedTime",
          label: "Allowed Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = workElementTimeAllowanceTool.execute;
export default workElementTimeAllowanceTool;
