import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dueReturnTime: number;
  readonly actualReturnTime: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dueReturnTime: { type: "number" },
    actualReturnTime: { type: "number" },
  },
  required: ["dueReturnTime", "actualReturnTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed actual-minus-due shared-space key return lag in a common monotonic time basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dueReturnTime, actualReturnTime } = request;
  const compute = (): Output => {
    return { signedGap: actualReturnTime - dueReturnTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dueReturnTime: 12, actualReturnTime: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const sharedSpaceKeyReturnLagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/shared-space-key-return-lag",
    title: "Shared Space Key Return Lag",
    description:
      "Calculate signed actual-minus-due shared-space key return lag in a common monotonic time basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dueReturnTime: { type: "number" },
        actualReturnTime: { type: "number" },
      },
      required: ["dueReturnTime", "actualReturnTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "dueReturnTime",
          label: "Due Return Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualReturnTime",
          label: "Actual Return Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sharedSpaceKeyReturnLagTool.execute;
export default sharedSpaceKeyReturnLagTool;
