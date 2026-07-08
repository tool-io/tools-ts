import { createSimpleTool } from "../../core/simple.js";
export const reverseDigitsTool = createSimpleTool({
  id: "number/reverse-digits",
  title: "Reverse Integer Digits Tool",
  description:
    "Reverse the base-10 digits of a safe integer while preserving its sign.",
  inputs: [{ id: "value", label: "Integer", kind: "integer" }],
  outputs: [{ id: "reversed", label: "Reversed integer", kind: "integer" }],
  calculate: (input) => {
    const value = input.value as number;
    const reversed =
      Number([...Math.abs(value).toString()].reverse().join("")) *
      Math.sign(value);
    return { reversed };
  },
});
export const runReverseDigits = reverseDigitsTool.execute;
export default reverseDigitsTool;
