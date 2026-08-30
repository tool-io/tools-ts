import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UartBaudDividerInput = Readonly<{
  readonly clockHertz: number;
  readonly baudRate: number;
  readonly oversampling: number;
}>;
export type UartBaudDividerOutput = Readonly<{
  readonly idealDivider: number;
}>;

export const calculateUartBaudDivider = (
  x: UartBaudDividerInput,
): UartBaudDividerOutput => {
  if (!Number.isFinite(x.clockHertz) || x.clockHertz < 0)
    simpleError("clockHertz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.baudRate) || x.baudRate < 0)
    simpleError("baudRate", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.oversampling) ||
    !Number.isSafeInteger(x.oversampling) ||
    x.oversampling < 0
  )
    simpleError("oversampling", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.oversampling) || x.oversampling < 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const idealDivider = x.clockHertz / (x.baudRate * x.oversampling);
  if (!Number.isFinite(idealDivider))
    simpleError(
      "idealDivider",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { idealDivider: Object.is(idealDivider, -0) ? 0 : idealDivider };
};

export const example = {
  input: { clockHertz: 16000000, baudRate: 115200, oversampling: 16 },
  output: { idealDivider: 8.680555555555555 },
} satisfies ToolExample<UartBaudDividerInput, UartBaudDividerOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/uart-baud-divider",
  title: "UART Baud Divider",
  description:
    "Ideal UART oversampling divider before register quantization from peripheral clock, baud rate and oversampling factor.",
  inputs: [
    {
      id: "clockHertz",
      kind: "number",
      label: "Clock Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "baudRate",
      kind: "number",
      label: "Baud Rate",
      unit: "baud",
      minimum: 0,
    },
    { id: "oversampling", kind: "integer", label: "Oversampling", minimum: 0 },
  ],
  outputs: [{ id: "idealDivider", kind: "number", label: "Ideal Divider" }],
  calculate: (input) =>
    calculateUartBaudDivider({
      clockHertz: input.clockHertz as number,
      baudRate: input.baudRate as number,
      oversampling: input.oversampling as number,
    }),
});
export const uartBaudDividerTool = tool;
export const runUartBaudDivider = tool.execute;
export default tool;
