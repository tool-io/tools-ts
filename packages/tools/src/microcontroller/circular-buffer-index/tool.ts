import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CircularBufferIndexInput = Readonly<{
  readonly headIndex: number;
  readonly offset: number;
  readonly capacity: number;
}>;
export type CircularBufferIndexOutput = Readonly<{
  readonly wrappedIndex: number;
}>;

export const calculateCircularBufferIndex = (
  x: CircularBufferIndexInput,
): CircularBufferIndexOutput => {
  if (
    !Number.isFinite(x.headIndex) ||
    !Number.isSafeInteger(x.headIndex) ||
    x.headIndex < 0
  )
    simpleError("headIndex", "Provide a safe integer at least 0.");
  if (!Number.isFinite(x.offset) || !Number.isSafeInteger(x.offset))
    simpleError("offset", "Provide a safe integer.");
  if (
    !Number.isFinite(x.capacity) ||
    !Number.isSafeInteger(x.capacity) ||
    x.capacity < 0
  )
    simpleError("capacity", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.headIndex) ||
    !Number.isSafeInteger(x.offset) ||
    !Number.isSafeInteger(x.capacity) ||
    x.capacity < 1 ||
    x.headIndex >= x.capacity
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const modulus = BigInt(x.capacity);
  const wrappedIndex = Number(
    (((BigInt(x.headIndex) + BigInt(x.offset)) % modulus) + modulus) % modulus,
  );
  if (!Number.isFinite(wrappedIndex) || !Number.isSafeInteger(wrappedIndex))
    simpleError(
      "wrappedIndex",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { wrappedIndex: Object.is(wrappedIndex, -0) ? 0 : wrappedIndex };
};

export const example = {
  input: { headIndex: 2, offset: -3, capacity: 8 },
  output: { wrappedIndex: 7 },
} satisfies ToolExample<CircularBufferIndexInput, CircularBufferIndexOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/circular-buffer-index",
  title: "Circular Buffer Index",
  description:
    "Wrap a signed offset around a zero-based circular buffer without changing the stored head index.",
  inputs: [
    { id: "headIndex", kind: "integer", label: "Head Index", minimum: 0 },
    { id: "offset", kind: "integer", label: "Offset" },
    { id: "capacity", kind: "integer", label: "Capacity", minimum: 0 },
  ],
  outputs: [{ id: "wrappedIndex", kind: "integer", label: "Wrapped Index" }],
  calculate: (input) =>
    calculateCircularBufferIndex({
      headIndex: input.headIndex as number,
      offset: input.offset as number,
      capacity: input.capacity as number,
    }),
});
export const circularBufferIndexTool = tool;
export const runCircularBufferIndex = tool.execute;
export default tool;
