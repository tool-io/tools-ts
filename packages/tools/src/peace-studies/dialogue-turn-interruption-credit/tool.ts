import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly turnMinutes: number;
  readonly interruptedMinutes: number;
  readonly restoredMinutes: number;
};
export type Output = {
  readonly netLostMinutes: number;
  readonly creditedMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    turnMinutes: { type: "number", minimum: 0 },
    interruptedMinutes: { type: "number", minimum: 0 },
    restoredMinutes: { type: "number", minimum: 0 },
  },
  required: ["turnMinutes", "interruptedMinutes", "restoredMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netLostMinutes: { type: "number" },
    creditedMinutes: { type: "number" },
  },
  required: ["netLostMinutes", "creditedMinutes"],
} as const;
/** Time accounting for supplied interruption annotations without judging intent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { turnMinutes, interruptedMinutes, restoredMinutes } = request;
  const compute = (): Output => {
    H.domain(
      turnMinutes >= 0 &&
        interruptedMinutes >= 0 &&
        interruptedMinutes <= turnMinutes &&
        restoredMinutes >= 0 &&
        restoredMinutes <= interruptedMinutes,
    );
    return {
      netLostMinutes: interruptedMinutes - restoredMinutes,
      creditedMinutes: turnMinutes - interruptedMinutes + restoredMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { turnMinutes: 10, interruptedMinutes: 3, restoredMinutes: 1 },
  output: { netLostMinutes: 2, creditedMinutes: 8 },
} satisfies ToolExample<Input, Output>;
export const dialogueTurnInterruptionCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/dialogue-turn-interruption-credit",
    title: "Dialogue Turn Interruption Credit Tool",
    description:
      "Time accounting for supplied interruption annotations without judging intent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        turnMinutes: { type: "number", minimum: 0 },
        interruptedMinutes: { type: "number", minimum: 0 },
        restoredMinutes: { type: "number", minimum: 0 },
      },
      required: ["turnMinutes", "interruptedMinutes", "restoredMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netLostMinutes: { type: "number" },
        creditedMinutes: { type: "number" },
      },
      required: ["netLostMinutes", "creditedMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "turnMinutes",
          label: "Turn Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interruptedMinutes",
          label: "Interrupted Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "restoredMinutes",
          label: "Restored Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netLostMinutes",
          label: "Net Lost Minutes",
          valueType: { type: "number" },
        },
        {
          id: "creditedMinutes",
          label: "Credited Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dialogueTurnInterruptionCreditTool.execute;
export default dialogueTurnInterruptionCreditTool;
