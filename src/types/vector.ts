export type Vector = [number, number, number];
export const isVector = (value: any): value is Vector => {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((element) => typeof element === "number")
  );
};

export type Quaternion = [number, number, number, number];
export const isQuaternion = (value: any): value is Quaternion => {
  return (
    Array.isArray(value) &&
    value.length === 4 &&
    value.every((element) => typeof element === "number")
  );
};

export type Embendding = Float32Array;
export const isEmbendding = (value: any): value is Embendding => {
  return value instanceof Float32Array;
};
