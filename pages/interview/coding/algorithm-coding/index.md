# Algorithm Coding

## 实现斐波那契数列

```js
递归 // [!code ++]
function fibonacci(n) {
  if(n<=1){
    return n
  }else {
    return fibonacci(n-1)+fibonacci(n-2)
  }
}
console.log(fibonacci(10));//55
```

```js
// 迭代 // [!code ++]
function fibonacci(n) {
  let a = 0, b = 1, sum;
  for(let i=2;i<=n;i++){
    sum = a + b;
    a = b;
    b = sum;
  }
  return b
}
console.log(fibonacci(10));//55
```

```js
// 动态规划 // [!code ++]
function fibonacci(n) {
  let dp = new Array(n+1).fill(0)
  dp[1] = 1
  for(let i=2;i<=n;i++){
    dp[i] = dp[i-1] + dp[i-2]
  }
  return dp[n]
}
console.log(fibonacci(10));//55
```

## 广度优先遍历
一种用于遍历或搜索图或树的算法，它从根节点开始，依次遍历其兄弟节点，再遍历第一个节点的子节点，依次类推，直到遍历完所有节点。
```js
function breadthFirstSearch(root) {
  if(root === null){
    return 
  }
  const queue = [root];
  while(queue.length){
    const node = queue.shift();
    console.log(node.val);
    for(let child of node.children){
      queue.push(child);
    }
  }
}

const root = {
  val: 1,
  children: [
    {
      val: 2,
      children: [
        {
          val: 4,
          children: []
        },
        {
          val: 5,
          children: []
        }
      ]
    },
    {
      val: 3,
      children: [
        {
          val: 6,
          children: []
        },
        {
          val: 7,
          children: []
        }
      ]
    }
  ]
}
breadthFirstSearch(root); // 1 2 3 4 5 6 7
```

## 深度优先遍历

## 字符串

### 字符串中出现的不重复字符最长长度
输入一个字符串，返回该字符串中不重复的字符的最长长度
```js
滑动窗口 // ![code ++] 
function findMaxNoRepeatStrLength(str){
  let maxLength = 0 
  let startIndex = 0; // 记录当前子串的起始位置
  let set = new Set() // 记录当前子串中出现过的字符
  for(let i=0;i<str.length;i++){
    //滑动窗口右移
    while(set.has(str[i])){
      set.delete(str[i])
      startIndex++;
    }
    set.add(str[i])
    maxLength = Math.max(maxLength,i-startIndex+1)
  }
  return maxLength
}
console.log(findMaxNoRepeatStrLength('abcabcbb'));//3
```

### 不重复字符下标
输入一个字符串，返回第一个不重复字符的下标
```js
function findFirstNoRepeatCharIndex(str) {
  let map = new Map()
  for(let key of str){
    if(map.has(key)){
      map.set(key,map.get(key)+1)
    }else {
      map.set(key,1)
    }
  }
  for(let i=0;i<str.length;i++){
    if(map.get(str[i])===1){
      return i
    }
  }
  return -1
}
console.log(findFirstNoRepeatCharIndex('abcabcbbd')); // 8
```

###  所有字符排列
输入一个字符串，返回该字符串的所有字符的不重复排列

```js
function findAllSortStr(str) {
  const res = [];
  const count = {};  
  for (let char of str) {
    count[char] = (count[char] || 0) + 1;  // 统计每个字符的出现次数
  }
  
  function backtrack(temp) {
    if (temp.length === str.length) {
      res.push(temp.join(''));
      return;
    }
    
    for (let char in count) {
      if (count[char] > 0) {
        temp.push(char);
        count[char]--;  // 使用一个字符，减少其计数
        backtrack(temp);
        count[char]++;  // 回溯，恢复计数
        temp.pop();     // 移除最后一个字符
      }
    }
  }
  
  backtrack([]);
  return res;
}
console.log(findAllSortStr('abca')) //['aabc', 'aacb','abac', 'abca','acab', 'acba','baac', 'baca','bcaa', 'caab','caba', 'cbaa']
console.log(findAllSortStr('abc')); // ['abc', 'acb', 'bac', 'bca', 'cab', 'cba']
```


## 数组

### 冒泡排序
1. 遍历数组，比较相邻的两个元素，如果前面的元素大于后面的元素，则交换位置
2. 重复1，直到数组排序完成
3. 时间复杂度为O(n^2)，空间复杂度为O(1)

```js
function bubblesort(arr) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
console.log(bubblesort([3, 4, 1, 5, 2])); // [1, 2, 3, 4, 5]
```

### 选择排序
1. 选择最小的元素，放到数组的最前面
2. 重复1，直到数组排序完成
3. 时间复杂度为O(n^2)，空间复杂度为O(1)
```js
function selectSort(arr) {
  let len = arr.length;
  for(let i=0;i<len-1;i++){
    let minIndex = i;
    //注意：j<len,j从i+1开始,j<len,j之前的元素已经排序完毕，不用再比较，j之后的元素还没有排序
    for(let j=i+1;j<len;j++){
      if(arr[j] < arr[minIndex]){
        minIndex = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
  return arr;
}
console.log(selectSort([3, 4, 1, 5, 2])); // [1, 2, 3, 4, 5]
```

### 插入排序
1. 构建有序序列，对于未排序的数据，从后往前扫描已经排序的序列，找到相应位置并插入
2. 重复1，直到数组排序完成
3. 时间复杂度为O(n^2)，空间复杂度为O(1)
```js
function insertSort(arr){
  let len = arr.length;
  for(let i=1;i<len;i++){
    let temp = arr[i]
    let j = i-1;
    while(j>=0 && arr[j]>temp){
      arr[j+1] = arr[j]
      j--
    }
    arr[j+1] = temp
  }
  return arr;
}
console.log(insertSort([3, 4, 1, 5, 2])); // [1, 2, 3, 4, 5]
```

### 快速排序
1.  采用分治法，选取一个元素作为基准，将数组分成两个子数组，左边的子数组元素都小于基准，右边的子数组元素都大于基准
2.  递归地对两个子数组进行排序
3.  重复1，直到数组排序完成
4.  时间复杂度为O(nlogn)，空间复杂度为O(logn)
```js
function quickSort(arr) {
  let len = arr.length;
  if(len<=1){
    return arr;
  }
  let pivot = arr[Math.floor(len/2)];
  let left = [];
  let right = [];
  for(let i=0;i<len;i++){
    if(arr[i]<pivot){
      left.push(arr[i]);
    }else if(arr[i]>pivot){
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat(pivot,quickSort(right));
}
console.log(quickSort([3, 4, 2, 5, 1])); // [1, 2, 3, 4, 5]
```

### 两数之和
输入一个整数数组和一个目标值，返回两个数的下标，使得它们的和等于目标值。
```js
function twoSum(nums, target) {
  let map = new Map()
  for(let i=0;i<nums.length;i++){
    let complement = target - nums[i]
    if(map.has(complement)){
      return [map.get(complement),i]
    }
    map.set(nums[i],i)
  }
  return []
}
console.log(twoSum([2,7,11,15],9)) // [0,1]
```

### 三数之和
输入一个整数数组和一个目标值，返回所有和为目标值的不重复的三元组。
```js
双指针，O(n^2) // ![code ++]
function threeSum(nums, target) {
  let res = [];
  //首先要经过排序
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length - 2; i++) {
    // 去除重复的元素
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue; 
    }
    //双指针
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      let sum = nums[i] + nums[left] + nums[right];
      if (sum === target) {
        res.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        // 去除重复的三数组合
        while (left < right && nums[left] === nums[left - 1]) {
          left++;
        }
        while (left < right && nums[right] === nums[right + 1]) {
          right--;
        }
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }
  return res;
}
console.log(threeSum([-1,0,1,2,-1,-4], 0)); /// [[-1, -1, 2], [-1, 0, 1]]
console.log(threeSum([-2,0,0,2,2], 0));// [[-2, 0, 2]]
```

## 树

### 判断某数组是否是二叉查找树前序遍历结果
利用二叉查找树的特性：所有的左子节点的值都小于根节点的值，所有的右子节点的值都大于根节点的值。
```js
function isTrueTree(arr){
  if(arr.length === 0){
    return true
  }
  let rootValue = arr[0]
  let leftTree = []
  let rightTree = []
  for(let i=1;i<arr.length;i++){
    if(arr[i] < rootValue){
      leftTree.push(arr[i])
    }else {
      rightTree.push(arr[i])
    }
  }
  return (isTrueTree(leftTree) && isTrueTree(rightTree) && rightTree.every(item => item > rootValue))
}
console.log(isTrueTree([8,5,17,10,12])) 
console.log(isTrueTree([8,5,10,1,7,12]))
```



## 事件

### 停车位
给定一个二维数组，里面一个个数组代表了一俩车的起始停车时间和终止停车时间，返回最少需要多少个停车位。
1. 将每个停车时间的开始和结束记录成两个事件（停车事件和离开事件）
2. 将所有事件按照时间进行排序。如果事件时间相同，应该根据事件类型（停车优先于离开）进行排序。这是为了确保在同一时间，停车的车辆会首先被计算在内。
3. 遍历排序后的事件数组，维护一个当前的停车位占用计数，根据事件类型更新这一计数，并记录最大值。
4. 扫描线算法：这种算法是扫描线算法的一种特例，广泛用于许多与时间或空间有关的问题，如会议室预订、区间合并等等。
```js
function minParkingSpaces(times) {
  const events = [];

  // 将停车和离开的时间都记录为事件
  times.forEach(time => {
    events.push([time[0], 1]); // 停车事件
    events.push([time[1], -1]); // 离开事件
  });
  console.log(events);
  
  // 按时间排序，如果时间相同，停车事件优先
  events.sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1] - b[1]; // 停车(1) 优先级高于离开(-1)
    }
    return a[0] - b[0];
  });
  console.log(events);
  
  let currentParking = 0; // 当前停车位占用数量
  let maxParking = 0; // 最大占用停车位

  // 遍历所有事件
  events.forEach(event => {
    currentParking += event[1];
    maxParking = Math.max(maxParking, currentParking);
  });

  return maxParking;
}

const parkingTimes = [[0, 30], [5, 15], [20, 30],[0,40],[0,5],[5,10]];
console.log(minParkingSpaces(parkingTimes)); // 输出 4
```


## 滑动窗口

### 滑动窗口最大值
给定一个整数数组，有一个大小为K的滑动窗口，从数组的最左侧移动到最右侧，每次移动窗口都向右滑动一个位置。返回滑动窗口中的最大值。
1. 移除超出窗口范围的元素，即索引i-k的元素
2. 保持队列的单调性
3. 将当前元素添加到队列尾部
4. 如果窗口形成，即i>=k-1,则将队列头部元素添加到结果数组中
```js
function maxSildingWindow(arr,k){
  let res = []
  let deque = [] // 双端队列，记录滑动窗口的索引
  // 移除队列中超过窗口范围的元素
  function removeOUtdated(index){
    while(deque.length && deque[0] <= index - k){
      deque.shift()
    }
  }
  //保持队列的单调性，当队列尾的元素小于当前元素，则弹出队列尾元素，直到队列尾元素大于当前元素
  function maintainDeque(index){
    while(deque.length && arr[index] > arr[deque[deque.length - 1]]){
      deque.pop()
    }
  }
  for(let i=0;i<arr.length;i++){
    removeOUtdated(i)
    maintainDeque(i)
    deque.push(i)
    //返回当前窗口最大值
    if(i >= k-1){
      res.push(arr[deque[0]])
    }
  }
  return res
}
console.log(maxSildingWindow([1,3,-1,-3,5,3,6,7],3))// [3,3,5,5,6,7]
```

## DP

### 买卖股票

给定一个整数数组，第i个元素代表第i天的股票价格，fee为交易手续费，求最大利润。

```js
function findMaxProfit(prices,fee) {
  if(prices.length <= 1){
    return 0
  }
  let maxProfit = 0 // 最大利润
  let holdProfit = -prices[0] // 持有股票的最大利润
  for(let i=1;i<prices.length;i++){
    maxProfit = Math.max(maxProfit,holdProfit + prices[i] - fee) // 计算卖出股票的最大利润
    holdProfit = Math.max(holdProfit,maxProfit   - prices[i]) // 计算持有股票的最大利润
  }
  return maxProfit
}
console.log(findMaxProfit([1,3,2,8,4,9],2)) // 8
```