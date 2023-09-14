import { Dispatch, SetStateAction } from "react";

export function setStateWithCallback<T>(
  currentValue: T,
  setValue: Dispatch<SetStateAction<T>>,
  callback?: (value: T) => void,
  preprocess?: (value: T) => T,
) {
  function func(value: T | ((value: T) => T)) {
    // get the new value to be passed to setState
    let newValue;
    if (value instanceof Function) {
      newValue = value(currentValue);
    } else {
      newValue = value;
    }

    // preprocess the new value before setting it as value
    if (preprocess !== undefined) newValue = preprocess(newValue);

    // actually set the value
    setValue(newValue);

    // do callbacks
    if (callback !== undefined) callback(newValue);
  }

  return func;
}

export async function imageBlobToBase64(blob: Blob) {
  return new Promise((onSuccess, onError) => {
    try {
      const reader = new FileReader();
      reader.onload = function () {
        onSuccess(this.result);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      onError(e);
    }
  });
}
