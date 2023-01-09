export class MathUtils {
  // 0.2 + 0.1 = 0.30000000000000004, result needs to convert to 0.3
  static convertToNonZerosDecimal = function (value: number): number {
    const val = value.toFixed(8);
    return +val;
  };
}
