import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const uartBaudRateErrorExample = {
  input: { actualBaud: 9615, targetBaud: 9600 },
} satisfies ToolExample<{
  readonly actualBaud: number;
  readonly targetBaud: number;
}>;

export const uartBaudRateErrorTool = createSimpleTool({
  id: "electronics/uart-baud-rate-error",
  title: "UART Baud Error %",
  description:
    "Compute the percentage error of an actual UART baud rate relative to a target baud rate.",
  inputs: [
    {
      id: "targetBaud",
      label: "Target baud rate",
      kind: "number",
      unit: "baud",
    },
    {
      id: "actualBaud",
      label: "Actual baud rate",
      kind: "number",
      unit: "baud",
    },
  ],
  outputs: [
    {
      id: "baudErrorPercent",
      label: "Baud rate error",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const targetBaud = input.targetBaud as number;
    const actualBaud = input.actualBaud as number;
    if (!(targetBaud > 0))
      simpleError("targetBaud", "Target baud rate must be positive.");
    if (!(actualBaud > 0))
      simpleError("actualBaud", "Actual baud rate must be positive.");
    return {
      baudErrorPercent: (Math.abs(actualBaud - targetBaud) / targetBaud) * 100,
    };
  },
});
export const runUartBaudRateError = uartBaudRateErrorTool.execute;
export default uartBaudRateErrorTool;
