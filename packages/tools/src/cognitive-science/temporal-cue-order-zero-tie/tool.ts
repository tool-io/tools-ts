import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly secondTime: number;
  readonly tiePolicy: string;
};
export type Output = { readonly order: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number" },
    secondTime: { type: "number" },
    tiePolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["simultaneous", "first", "second"],
    },
  },
  required: ["firstTime", "secondTime", "tiePolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { order: { type: "string", maxLength: 8192 } },
  required: ["order"],
} as const;
/** Order supplied cue timestamps with an explicit exact-tie convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTime, secondTime, tiePolicy } = request;
  const compute = (): Output => {
    H.domain(["simultaneous", "first", "second"].includes(tiePolicy));
    return {
      order:
        firstTime < secondTime
          ? "first"
          : secondTime < firstTime
            ? "second"
            : tiePolicy,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstTime: 10, secondTime: 10, tiePolicy: "simultaneous" },
  output: { order: "simultaneous" },
} satisfies ToolExample<Input, Output>;
export const temporalCueOrderZeroTieTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/temporal-cue-order-zero-tie",
    title: "Temporal Cue Order Zero Tie Tool",
    description:
      "Order supplied cue timestamps with an explicit exact-tie convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTime: { type: "number" },
        secondTime: { type: "number" },
        tiePolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["simultaneous", "first", "second"],
        },
      },
      required: ["firstTime", "secondTime", "tiePolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { order: { type: "string", maxLength: 8192 } },
      required: ["order"],
    },
    ports: {
      inputs: [
        {
          id: "firstTime",
          label: "First Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTime",
          label: "Second Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tiePolicy",
          label: "Tie Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "order", label: "Order", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = temporalCueOrderZeroTieTool.execute;
export default temporalCueOrderZeroTieTool;
