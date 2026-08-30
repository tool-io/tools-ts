export type CrcParameters = {
  readonly init: bigint;
  readonly polynomial: bigint;
  readonly reflectInput: boolean;
  readonly reflectOutput: boolean;
  readonly width: number;
  readonly xorOutput: bigint;
};

const reflect = (value: bigint, width: number): bigint => {
  let reflected = 0n;
  for (let bit = 0; bit < width; bit += 1) {
    reflected = (reflected << 1n) | ((value >> BigInt(bit)) & 1n);
  }
  return reflected;
};

export const crc = (
  bytes: readonly number[],
  parameters: CrcParameters,
): bigint => {
  const width = BigInt(parameters.width);
  const mask = (1n << width) - 1n;
  const topBit = 1n << (width - 1n);
  let value = parameters.init & mask;
  for (const sourceByte of bytes) {
    const byte = parameters.reflectInput
      ? Number(reflect(BigInt(sourceByte), 8))
      : sourceByte;
    value ^= BigInt(byte) << (width - 8n);
    for (let bit = 0; bit < 8; bit += 1) {
      value =
        value & topBit
          ? ((value << 1n) ^ parameters.polynomial) & mask
          : (value << 1n) & mask;
    }
  }
  if (parameters.reflectOutput) value = reflect(value, parameters.width);
  return (value ^ parameters.xorOutput) & mask;
};
