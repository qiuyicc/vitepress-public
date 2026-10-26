function quickSort(arr) {
  let len = arr.length;
  if (len <= 1) {
    return arr;
  }

  let pro = arr[Math.floor(len / 2)];
  const left = [];
  const right = [];

  for (let i = 0; i < len; i++) {
    if (i === Math.floor(len / 2)) continue;
    if (arr[i] < pro) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat(pro, quickSort(right));
}

console.log(quickSort([3, 1, 2, 2, 3, 4, 6, 7, 8, 5]))
