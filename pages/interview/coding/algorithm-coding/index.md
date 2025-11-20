# Algorithm Coding

## 栈

单调栈的核心：

1. 从左向右，核心思想是将没有找到下一个最大值的元素存进单调栈中（连续单减区间（从左向右看））。
2. 从右向左：核心思想是将下一个最大值存进单调栈中（连续单增区间（从左向右看））；

### 每日温度

1. 思路 1,双层遍历,时间复杂度 O(n^2),空间复杂度 O(n)

```js
var dailyTemperatures = function (temperatures) {
  const len = temperatures.length;
  const result = Array(len).fill(0);
  for (let i = 0; i < len; i++) {
    const num = temperatures[i];
    let j = i + 1;
    while (j < len) {
      if (temperatures[j] > num) {
        result[i] = j - i;
        break;
      }
      j++;
    }
  }
  return result;
};
```

2. 思路 2，单调栈，此题和下面一题：下一个更大的元素||的单调栈做法类似,时间复杂度 O(n),空间复杂度 O(n)

```js
var dailyTemperatures = function (temperatures) {
  const len = temperatures.length;
  const result = Array(len).fill(0);
  const stack = [];
  for (let i = 0; i < len; i++) {
    const num = temperatures[i];
    // 虽然是双重循环，但是每个元素最多进栈一次，出栈一次，所以时间复杂度是O(n)
    // 从左向右遍历，保存了
    while (stack.length && num > temperatures[stack[stack.length - 1]]) {
      const index = stack.pop();
      result[index] = i - index;
    }
    stack.push(i);
  }
  return result;
};
```

### 下一个更大的元素||

给定一个循环数组 nums （ nums[nums.length - 1] 的下一个元素是 nums[0] ），返回 nums 中每个元素的 下一个更大元素 。[下一个更大的元素||](https://leetcode.cn/problems/next-greater-element-ii/description/)

1. 思路 1，直接双层遍历找到，先遍历右边再遍历左边

```js
var nextGreaterElements = function (nums) {
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    let cur = nums[i];
    let isPushed = false;
    const arr = [];
    // 遍历该项的右边
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] > cur) {
        result.push(nums[j]);
        isPushed = true;
        break;
      }
    }
    // 如果没有，继续遍历该项的左边
    if (!isPushed) {
      for (let j = 0; j < i; j++) {
        if (nums[j] > cur) {
          result.push(nums[j]);
          isPushed = true;
          break;
        }
      }
    }
    // 如果还是没有
    if (!isPushed) {
      result.push(-1);
    }
  }
  return result;
};
```

2. 单调栈
   通过遍历线性数组，然后对比单调栈里面的值，如果当前值大于栈顶值，则栈顶值的下一个更大元素就是当前值，然后栈顶值出栈，继续对比，直到栈为空或者当前值小于栈顶值，然后当前值入栈。

```js
var findNextGreaterElement = function (nums) {
  const len = nums.length;
  const result = Array(len).fill(-1);
  const stack = [];
  for (let i = 0; i < 2 * len; i++) {
    const num = nums[i % len];
    while (stack.length && num > nums[stack[stack.length - 1]]) {
      result[stack.pop()] = num;
    }
    if (i < len) {
      stack.push(i);
    }
  }
  return result;
};
```

### 移除 K 位数字

给你一个以字符串表示的非负整数 num 和一个整数 k ，移除这个数中的 k 位数字，使得剩下的数字最小。请你以字符串形式返回这个最小的数字。[移除 K 位数字](https://leetcode.cn/problems/remove-k-digits/description/)

1. 思路，利用栈，从左到右遍历，如果当前数字小于栈顶数字，则移除栈顶数字，直到栈为空或者 k 为 0

```js
// 123531这样「高位递增」的数，肯定不会想删高位，会尽量删低位
// 432135这样「高位递减」的数，会想干掉高位，直接让高位变小，效果好
// 所以，如果当前遍历的数比栈顶大，符合递增，是满意的，让它入栈,如果当前遍历的数字比栈顶小，让他出栈
var removeKdigits = function (num, k) {
  const stack = [];
  for (let i = 0; i < num.length; i++) {
    const s = num[i];
    // 如果当前数字小于栈顶数字，则移除栈顶数字，直到栈为空或者k为0
    while (k > 0 && stack.length && s < stack[stack.length - 1]) {
      stack.pop();
      k--;
    }
    // 如果当前数字不为0，或者栈不为空，则将当前数字入栈
    if (s !== "0" || stack.length) {
      stack.push(s);
    }
  }
  // 如果遍历完成k还未完成，则继续移除栈顶数字
  while (k > 0) {
    stack.pop();
    k--;
  }
  // 如果栈为空，则返回0，否则返回栈中的数字
  return !stack.length ? "0" : stack.join("");
};
```

### 字符串解码

给定一个经过编码的字符串，返回它解码后的字符串。s = "3[a2[c]]"，返回 "accaccacc" [字符串解码](https://leetcode.cn/problems/decode-string/description/)

1. 思路，利用栈来模拟递归

```js
var decodeString = function (s) {
  const stack = [];
  let res = "",
    k = 0;
  for (let item of s) {
    if ("a" <= item && item <= "z") {
      res += item;
    } else if ("0" <= item && item <= "9") {
      // 此处需要处理多位数的情况，比如 "123[a]"，k 需要是 123
      // 第一次，k = 0，item = '1'，k = 1
      // 第二次，k = 1，item = '2'，k = 12
      // 第三次，k = 12，item = '3'，k = 123
      k = k * 10 + parseInt(item);
    } else if (item === "[") {
      stack.push([res, k]);
      res = "";
      k = 0;
    } else if (item === "]") {
      const [pre_res, pre_k] = stack.pop();
      // 此时，注意res为当前[]中的字符串，需要重复[]之前的pre_k次，拼接在上一次结果pre_res之后
      res = pre_res + res.repeat(pre_k);
    }
  }
  return res;
};
```

### 简化路径

给你一个字符串 path ，表示指向某一文件或目录的 Unix 风格 绝对路径 （以 '/' 开头），请你将其转化为 更加简洁的规范路径 [简化路径](https://leetcode.cn/problems/simplify-path/)

1. 思路，利用栈，遇到/就入栈，遇到..就出栈，遇到.就忽略，最后把栈中的元素拼接起来

```js
var simplifyPath = function (path) {
  const result = [];
  const stack = path.split("/");
  for (let item of stack) {
    if (item === "..") {
      result.pop();
    } else if (item !== "." && item !== "") {
      result.push(item);
    }
  }
  return "/" + result.join("/");
};
```

### 有效的括号

没啥好说的，栈

```js
var isValid = function (s) {
  const arr = [];
  const arr1 = ["{", "(", "["];
  for (let item of s) {
    if (arr1.includes(item)) {
      arr.push(item);
    } else {
      const lastStr = arr[arr.length - 1];
      if (item === ")" && lastStr === "(") {
        arr.pop();
      } else if (item === "}" && lastStr === "{") {
        arr.pop();
      } else if (item === "]" && lastStr === "[") {
        arr.pop();
      } else {
        return false;
      }
    }
  }
  return arr.length ? false : true;
};
```

## 实现斐波那契数列

```js
递归; // [!code ++]
function fibonacci(n) {
  if (n <= 1) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}
console.log(fibonacci(10)); //55
```

```js
// 迭代 // [!code ++]
function fibonacci(n) {
  let a = 0,
    b = 1,
    sum;
  for (let i = 2; i <= n; i++) {
    sum = a + b;
    a = b;
    b = sum;
  }
  return b;
}
console.log(fibonacci(10)); //55
```

```js
// 动态规划 // [!code ++]
function fibonacci(n) {
  let dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
console.log(fibonacci(10)); //55
```

## 广度优先遍历

一种用于遍历或搜索图或树的算法，它从根节点开始，依次遍历其兄弟节点，再遍历第一个节点的子节点，依次类推，直到遍历完所有节点。

```js
function breadthFirstSearch(root) {
  if (root === null) {
    return;
  }
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    console.log(node.val);
    for (let child of node.children) {
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
          children: [],
        },
        {
          val: 5,
          children: [],
        },
      ],
    },
    {
      val: 3,
      children: [
        {
          val: 6,
          children: [],
        },
        {
          val: 7,
          children: [],
        },
      ],
    },
  ],
};
breadthFirstSearch(root); // 1 2 3 4 5 6 7
```

### 层序遍历

```js
var levelOrder = function (root) {
  if (!root) return [];
  const arr = [root];
  const result = [];
  while (arr.length) {
    let len = arr.length;
    const nodeVal = [];
    while (len--) {
      const node = arr.shift();
      nodeVal.push(node.val);
      if (node.left) {
        arr.push(node.left);
      }
      if (node.right) {
        arr.push(node.right);
      }
    }
    result.push(nodeVal);
  }
  return result;
};
```

```js
var levelOrder = function (root) {
  const bfs = (node, level) => {
    if (!node) return;
    if (!result[level]) result[level] = [];
    result[level].push(node.val);
    bfs(node.left, level + 1);
    bfs(node.right, level + 1);
  };
  bfs(root, 0);
  return result;
};
```

### 填充每个节点的下一个右侧节点指针|

给定一个完美二叉树，填充它的每个 next 指针[填充每个节点的下一个右侧节点指针|](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/description/)

```js
var connect = function (root) {
  if (!root) return null;
  const recursion = (left, right) => {
    if (!left && !right) return;
    left.next = right;
    recursion(left.left, left.right);
    recursion(left.right, right.left);
    recursion(right.left, right.right);
  };
  recursion(root.left, root.right);
  return root;
};
```

### 填充每个节点的下一个右侧节点指针||

给定一个二叉树，填充它的每个 next 指针，让这个指针指向其下一个右侧节点。如果找不到下一个右侧节点，则将 next 指针设置为 NULL[填充每个节点的下一个右侧节点指针||](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii/description/)

```js
var connect = function (root) {
  if (!root) return null;
  const pre = [];
  // 十分巧妙的的利用了bfs递归的实现思路，使用level作为额外中转
  const recursion = (node, level) => {
    if (!node) return;
    if (!pre[level]) {
      pre[level] = node;
    } else {
      pre[level].next = node;
      pre[level] = node;
    }
    recursion(node.left, level + 1);
    recursion(node.right, level + 1);
  };
  recursion(root, 0);
  return root;
};
```

利用 bfs 思想

```js
var connect = function (root) {
  let arr = [root];
  while (arr.length) {
    const tmp = arr;
    arr = [];
    for (let i = 0; i < tmp.length; i++) {
      const node = tmp[i];
      if (i) {
        tmp[i - 1].next = node;
      }
      if (node.left) {
        arr.push(node.left);
      }
      if (node.right) {
        arr.push(node.right);
      }
    }
  }
  return root;
};
```

## 深度优先遍历

## 双指针

### 长度最小的子数组

给定一个含有 n 个正整数的数组和一个正整数 target 。找出该数组中满足其总和大于等于 target 的长度最小的子数组(连续非空的数组),并返回长度[长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/description/)

1. 维护两个指针 left 和 right，并初始化 sum
2. 当 sum<target 的时候，right 向右移动，直到 sum>=target
3. 当 sum>=target 的时候，进行循环 left 收缩和 sum 收缩
4. 核心思路是维护一个滑动窗口，并且迭代进行窗口收缩

```js
var minSubArrayLen = function (target, nums) {
  let left = 0,
    right = 0;
  let min = 0;
  let sum = nums[left];
  // 需要进行边界判断
  while (left <= right && right < nums.length) {
    // 需要进行前置位sum判断，而不是后置位，主要是用于收缩
    if (sum < target) {
      // sum之和小于target，向右移动
      right++;
    } else {
      if (!min) {
        min = right - left + 1;
      } else {
        min = Math.min(min, right - left + 1);
      }
      // sum收缩，left收缩
      sum = sum - nums[left];
      left++;
      continue;
    }
    // 后置位sum
    sum += nums[right];
  }
  return min;
};
```

### 盛水最多的容器

给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i])找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水[盛水最多的容器](https://leetcode.cn/problems/container-with-most-water/description/)

1. 维护两个指针，一个指向数组最前面，一个指向数组最后面，然后计算他们的面积
2. 让其中一个指针朝大值前进

```js
var maxArea = function (height) {
  let left = 0,
    right = height.length - 1;
  let max = 0;
  while (left < right) {
    max = Math.max(max, Math.min(height[left], height[right]) * (right - left));
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
};
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
```

### 接雨水

给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。[接雨水](https://leetcode.cn/problems/trapping-rain-water/description/)

1. 左低右高，取左边
2. 右低左高，取右边

```js
var trap = function (height) {
  let left = 0,
    right = height.length - 1,
    max = 0,
    maxLH = 0,
    maxRH = 0;
  while (left < right) {
    // 更新左边和右边柱子的高度最大值
    maxLH = Math.max(maxLH, height[left]);
    maxRH = Math.max(maxRH, height[right]);
    // 左低右高，左位置接水量由左最大高度决定
    if (height[left] < height[right]) {
      max += maxLH - height[left];
      left++;
    } else {
      // 右低左高，右位置接水量由右最大高度决定
      max += maxRH - height[right];
      right--;
    }
  }
  return max;
};
```

### 三数之和

1. 首先进行排序,要跳过重复的元素
2. 维护两个指针，一个指向当前 i 最前面，一个指向数组最后面，然后计算三者之和
3. 如果三者之和为 0，则将三个数加入结果集，并跳过重复的元素继续寻找
4. 如果三者之和小于 0，则左指针右移
5. 如果三者之和大于 0，则右指针左移

```js
var threeSum = function (nums) {
  const num1 = nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < num1.length - 2; i++) {
    if (num1[i] === num1[i - 1]) continue;
    let left = i + 1,
      right = num1.length - 1;
    while (left < right) {
      // 计算三者之和
      const sum = num1[i] + num1[left] + num1[right];
      // 如果三者之和为0，则将三个数加入结果集，并跳过重复的元素继续寻找
      if (sum === 0) {
        result.push([num1[i], num1[left], num1[right]]);
        // 此处需要用while来跳过重复的元素
        while (num1[left] === num1[left + 1]) {
          left++;
        }
        while (num1[right] === num1[right - 1]) {
          right--;
        }
        // 跳过重复的元素之后还需移动指针
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
};
```

## 字符串

### 字符串中出现的不重复字符最长长度

输入一个字符串，返回该字符串中不重复的字符的最长长度

```js
滑动窗口; // ![code ++]
function findMaxNoRepeatStrLength(str) {
  let maxLength = 0;
  let startIndex = 0; // 记录当前子串的起始位置
  let set = new Set(); // 记录当前子串中出现过的字符
  for (let i = 0; i < str.length; i++) {
    //滑动窗口右移
    while (set.has(str[i])) {
      set.delete(str[i]);
      startIndex++;
    }
    set.add(str[i]);
    maxLength = Math.max(maxLength, i - startIndex + 1);
  }
  return maxLength;
}
console.log(findMaxNoRepeatStrLength("abcabcbb")); //3
```

```js
var lengthOfLongestSubstring = function (s) {
  if (!s) return 0;
  let max = 0;
  let left = 0,
    right = 0; // 从 0 开始

  while (right < s.length) {
    const str = s.slice(left, right); // 当前窗口（不包含right）
    const char = s[right]; // 当前要检查的字符

    if (str.indexOf(char) !== -1) {
      // 找到重复字符，更新max并移动left
      max = Math.max(max, right - left);
      const index = str.indexOf(char);
      left = left + index + 1; // 修正：left应该基于原字符串位置
    }
    right++;
  }
  // ✅ 关键：循环结束后，还要计算最后一个窗口的长度
  max = Math.max(max, right - left);
  return max;
};
```

### 不重复字符下标

输入一个字符串，返回第一个不重复字符的下标

```js
function findFirstNoRepeatCharIndex(str) {
  let map = new Map();
  for (let key of str) {
    if (map.has(key)) {
      map.set(key, map.get(key) + 1);
    } else {
      map.set(key, 1);
    }
  }
  for (let i = 0; i < str.length; i++) {
    if (map.get(str[i]) === 1) {
      return i;
    }
  }
  return -1;
}
console.log(findFirstNoRepeatCharIndex("abcabcbbd")); // 8
```

### 所有字符排列

输入一个字符串，返回该字符串的所有字符的不重复排列

```js
function findAllSortStr(str) {
  const res = [];
  const count = {};
  for (let char of str) {
    count[char] = (count[char] || 0) + 1; // 统计每个字符的出现次数
  }

  function backtrack(temp) {
    if (temp.length === str.length) {
      res.push(temp.join(""));
      return;
    }

    for (let char in count) {
      if (count[char] > 0) {
        temp.push(char);
        count[char]--; // 使用一个字符，减少其计数
        backtrack(temp);
        count[char]++; // 回溯，恢复计数
        temp.pop(); // 移除最后一个字符
      }
    }
  }

  backtrack([]);
  return res;
}
console.log(findAllSortStr("abca")); //['aabc', 'aacb','abac', 'abca','acab', 'acba','baac', 'baca','bcaa', 'caab','caba', 'cbaa']
console.log(findAllSortStr("abc")); // ['abc', 'acb', 'bac', 'bca', 'cab', 'cba']
```

## 数组

### 下一个排列

给你一个整数数组 nums ，找出 nums 的下一个排列。必须原地修改，只允许使用额外常数空间。  
思路：

1. 从右向左，找第一个数字 x，满足 x 右边有大于 x 的数，这样可以把 x 变大
2. 找 x 右边最小的大于 x 的数 y，交换 x 和 y
3. 反转 y 右边的数，把右边的数变成最小的排列
4. [1,3,5,4,2] => 找到 3，右边有 5，4，2，找到 4，交换 3 和 4，得到 [1,4,5,3,2]，反转 3 右边的数，得到 [1,4,2,3,5]

```js
function nextPermutation(nums: number[]): void {
  const n = nums.length;
  let i = n - 2;
  // 从右向左，找第一个数字 x，满足 x 右边有大于 x 的数 ，右侧的数必然递减
  while (i >= 0 && nums[i] >= nums[i + 1]) {
    i--;
  }
  // 如果没有找到，则说明原数组是降序排列，直接反转
  if (i >= 0) {
    let j = n - 1;
    // 找 x 右边最小的大于 x 的数 y
    while (j >= 0 && nums[j] <= nums[i]) {
      j--;
    }
    // 交换 x 和 y,交换之后仍然满足右侧的数递减
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  // 反转 y 右边的数，把右边的数变成最小的排列
  let left = i + 1,
    right = n - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
}
```

### 和为 K 的子数组

给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。子数组是数组中元素的连续非空序列

1. 思路 1，通过双层遍历来计算子数组的和

```js
function subarraySum(nums: number[], k: number): number {
  let resultCount = 0;
  const len = nums.length;
  for (let i = 0; i < len; i++) {
    let total = nums[i];
    if (total === k) {
      resultCount++;
    }
    for (let j = i + 1; j < len; j++) {
      total += nums[j];
      if (total === k) {
        resultCount++;
      }
    }
  }
  return resultCount;
}
```

2. 思路 2，通过前缀和来计算，用一个 Map（哈希表）来存储每个前缀和出现的次数。当我们在数组中向前移动时，我们逐步增加 pre（当前的累积和）。对于每个新的 pre 值，我们检查 pre - k 是否在 Map 中：pre - k 的意义：这个检查的意义在于，如果 pre - k 存在于 Map 中，说明之前在某个点的累积和是 pre - k。由于当前的累积和是 pre，这意味着从那个点到当前点的子数组之和恰好是 k（因为 pre - (pre - k) = k）。
   如果 pre - k 在 Map 中，那么 pre - k 出现的次数表示从不同的起始点到当前点的子数组和为 k 的不同情况。这是因为每一个 pre - k 都对应一个起点，使得从那个起点到当前点的子数组和为 k。因此，每当我们找到一个 pre - k 存在于 Map 中时，我们就把它的计数（即之前这种情况发生的次数）加到 count 上，因为这表示我们又找到了相应数量的以当前元素结束的子数组，其和为 k。

```js
function subarraySum(nums: number[], k: number): number {
  let resultCount = 0;
  let pre = 0;
  let map = new Map();
  map.set(0, 1);
  for (let i = 0; i < nums.length; i++) {
    pre += nums[i];
    if (map.has(pre - k)) {
      resultCount += map.get(pre - k);
    }
    map.set(pre, (map.get(pre) || 0) + 1);
  }
  return resultCount;
}
console.log(subarraySum([1, 1, 1], 2)); // 2
```

### 寻找峰值

1. 思路,不断向大值靠近，最终抵达峰值

```ts
function findPeakElement(nums: number[]): number {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    let middleIndex = Math.floor((left + right) / 2);
    let middle = nums[middleIndex];
    if (middle < nums[middleIndex + 1]) {
      left = middleIndex + 1;
    } else {
      right = middleIndex - 1;
    }
  }
  return left;
}
```

### 合并区间

1. 第一种思路，通过排序后双层遍历判断当前区别和后续区间是否需要合并，注意点：需要跳过后续已经合并的区间 && 区间合并时有序的，当前区间如果不能合并下一个区间可以直接退出；

```js
const intervals = [
  [1, 4],
  [0, 2],
  [3, 5],
];

function merge(intervals) {
  // 先对数组进行排序
  const arr = intervals.sort((a, b) => a[0] - b[0]);
  const res = [];
  // 记录已经合并的数组索引
  const alreadyMerged = [];
  debugger;
  for (let i = 0; i < arr.length; i++) {
    // 跳过已经合并区间的item
    if (alreadyMerged.includes(i)) {
      continue;
    }
    // 记录当前区间的右边界
    let right = arr[i][1];
    for (let j = i + 1; j < arr.length; j++) {
      // 这里要使用right来判断右边界，因为存在合并小区间之后可以合并大区间
      // 例如[1,4]和[0,2]合并之后可以得到[0,4]，这个区间可以继续和[3,5]合并
      if (right >= arr[j][0]) {
        // 取区间有边界的最大值
        right = Math.max(...[right, arr[j][1]]);
        // 标记当前区别已经合并过
        alreadyMerged.push(j);
      } else {
        break;
      }
    }
    res.push([arr[i][0], right]);
  }
  return res;
}
console.log(merge(intervals));
```

2. 对双层循环进行改造

```js
// 复杂度O(NLogN)
function merge(intervals) {
  // 先对数组进行排序
  const arr = intervals.sort((a, b) => a[0] - b[0]);
  const res = [];
  // 记录已经合并的数组最大索引
  let i = 0;
  // 虽然看起来是双层while循环，但是每个区间最多被访问一次，下一次会跳过已经合并的区间
  while (i < arr.length) {
    let right = arr[i][1];
    let j = i + 1;
    while (j < arr.length && right >= arr[j][0]) {
      right = Math.max(...[right, arr[j][1]]);
      j++;
    }
    res.push([arr[i][0], right]);
    i = j;
  }
  return res;
}
console.log(merge(intervals));
```

3. 使用一个指针来记录需要处理的区间

```js
// 复杂度O(NLogN)
function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  // 先按起始时间排序 - O(N log N)
  intervals.sort((a, b) => a[0] - b[0]);

  const result = [];
  let currentInterval = intervals[0]; // 当前正在处理的区间

  for (let i = 1; i < intervals.length; i++) {
    const nextInterval = intervals[i];
    // 如果当前区间与下一个区间有重叠
    if (currentInterval[1] >= nextInterval[0]) {
      // 合并区间，取最大的结束时间
      currentInterval[1] = Math.max(currentInterval[1], nextInterval[1]);
    } else {
      // 没有重叠，将当前区间加入结果
      result.push(currentInterval);
      currentInterval = nextInterval; // 切换到下一个区间
    }
  }
  // 加入最后一个区间
  result.push(currentInterval);
  return result;
}
console.log(merge(intervals));
```

### 搜索旋转排序数组

给你按照升序旋转后的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target 则返回它的下标，否则返回 -1，要求 O(logn)复杂度  
nums = [4,5,6,7,0,1,2], target = 0 输出 4

1. 第一种思路，因为数组是按照升序排列经过一定旋转后的，可以用最大值分隔出两个升序数组，然后对这两个升序数组进行二分查找。缺点：使用了 Math 和 lastIndexOf 等内置函数

```js
const arr = [4, 5, 6, 7, 0, 1, 2];
function search(nums, target) {
  debugger;
  const find = (arr) => {
    let right = arr.length - 1,
      left = 0;
    while (left <= right) {
      const middleIndex = Math.floor((left + right) / 2);
      const middle = arr[middleIndex];
      if (middle === target) {
        return middleIndex;
      } else if (middle > target) {
        right = middleIndex - 1;
      } else {
        left = middleIndex + 1;
      }
    }
    return -1;
  };

  const max = Math.max(...nums);
  const index = nums.lastIndexOf(max);
  if (max === target) {
    return index;
  } else {
    const leftRes = find(nums.slice(0, index));
    const rightRes = find(nums.slice(index + 1));
    return leftRes !== -1 ? leftRes : rightRes !== -1 ? rightRes : -1;
  }
}
search(arr, 0);
```

2. 第二种思路，通过二分之后两边一定是一个有序数组，另一个是有序数组或者部分有序，对有序数组进行判断，如果 target 在有序数组中，则进行迭代二分查找，否则在部分有序数组中进行二分查找。

```js
function search(nums, target) {
  let right = nums.length - 1,
    left = 0;
  while (left <= right) {
    const middleIndex = Math.floor((left + right) / 2);
    const middle = nums[middleIndex];
    if (middle === target) {
      return middleIndex;
    }
    // 如果左边是有序数组
    if (nums[left] <= middle) {
      // 如果target在左边有序数组中
      if (target >= nums[left] && target < middle) {
        right = middleIndex - 1;
      } else {
        left = middleIndex + 1;
      }
    } else {
      // 如果右边是有序数组
      // 如果target在右边有序数组中
      if (target > middle && target <= nums[right]) {
        left = middleIndex + 1;
      } else {
        right = middleIndex - 1;
      }
    }
  }
  return -1;
}
```

### 冒泡排序

1. 遍历数组，比较相邻的两个元素，如果前面的元素大于后面的元素，则交换位置
2. 重复 1，直到数组排序完成
3. 时间复杂度为 O(n^2)，空间复杂度为 O(1)

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
2. 重复 1，直到数组排序完成
3. 时间复杂度为 O(n^2)，空间复杂度为 O(1)

```js
function selectSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    let minIndex = i;
    //注意：j<len,j从i+1开始,j<len,j之前的元素已经排序完毕，不用再比较，j之后的元素还没有排序
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
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
2. 重复 1，直到数组排序完成
3. 时间复杂度为 O(n^2)，空间复杂度为 O(1)

```js
function insertSort(arr) {
  let len = arr.length;
  for (let i = 1; i < len; i++) {
    let temp = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > temp) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = temp;
  }
  return arr;
}
console.log(insertSort([3, 4, 1, 5, 2])); // [1, 2, 3, 4, 5]
```

### 快速排序

1.  采用分治法，选取一个元素作为基准，将数组分成两个子数组，左边的子数组元素都小于基准，右边的子数组元素都大于基准
2.  递归地对两个子数组进行排序
3.  重复 1，直到数组排序完成
4.  时间复杂度为 O(nlogn)，空间复杂度为 O(logn)

```js
function quickSort(arr) {
  let len = arr.length;
  if (len <= 1) {
    return arr;
  }
  let pivot = arr[Math.floor(len / 2)];
  let left = [];
  let right = [];
  for (let i = 0; i < len; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else if (arr[i] > pivot) {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat(pivot, quickSort(right));
}
console.log(quickSort([3, 4, 2, 5, 1])); // [1, 2, 3, 4, 5]
```

### 两数之和

输入一个整数数组和一个目标值，返回两个数的下标，使得它们的和等于目标值。

```js
function twoSum(nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
console.log(twoSum([2, 7, 11, 15], 9)); // [0,1]
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

### 最长数组递增子序列

1. 维护两个数组,一个记录每个位置的最长递增子序列长度，另一个记录每个位置的前一个位置
2. 通过两次遍历来构建这两个数组，并更新最长递增子序列的长度和结束位置
3. 回溯最长递增子序列

```js
function longestIncreasingSubsequence(nums) {
  if (nums.length === 0) return [];
  let lengths = new Array(nums.length).fill(1); // 记录每个位置的最长递增子序列长度
  let prevs = new Array(nums.length).fill(-1); // 记录每个位置的前一个位置
  let maxLength = 1; // 记录最长递增子序列的长度
  let endIndex = 0; // 记录最长递增子序列的结束位置
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      // 如果当前位置的值大于等于前一个位置的值，并且当前位置的最长递增子序列长度+1大于等于前一个位置的最长递增子序列长度
      if (nums[i] > nums[j] && lengths[j] + 1 > lengths[i]) {
        // 更新当前位置的最长递增子序列长度
        lengths[i] = lengths[j] + 1;
        prevs[i] = j;
      }
    }
    // 更新最长递增子序列的长度和结束位置
    if (lengths[i] > maxLength) {
      maxLength = lengths[i];
      endIndex = i;
    }
  }
  // 回溯最长递增子序列
  let res = [];
  while (endIndex !== -1) {
    res.unshift(nums[endIndex]);
    endIndex = prevs[endIndex];
  }
  return res;
}
console.log(longestIncreasingSubsequence([10, 9, 2, 5, 3, 7, 101, 18]));
```

## 树

### 二叉树的直径
给你一棵二叉树的根节点，返回该树的 直径 。[二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/description/)
```js
// 核心思路
// 递归每个节点时将该节点的左右节点路径深度相加并返回其最大值给上级
var diameterOfBinaryTree = function (root) {
  if (!root) return 0;
  let max = -1;
  const dfs = (root) => {
    if (!root.left && !root.right) {
      return 0;
    }
    const left = root.left === null ? 0 : dfs(root.left) + 1;
    const right = root.right === null ? 0 : dfs(root.right) + 1;
    // 维护当前节点路径和与max
    max = Math.max(max, left + right);
    // 返回当前节点最长路径给上级
    return Math.max(left, right);
  };
  dfs(root);
  return max;
};
```

### 二叉搜索树的最小绝对差

1. 注意二叉搜索树的中序遍历是递增的

```js
var getMinimumDifference = function (root) {
  if (!root) return 0;
  let min = Infinity,
    pre = null;
  const dfs = (root) => {
    if (!root) return;
    dfs(root.left);
    if (pre === null) {
      pre = root.val;
    } else {
      min = Math.min(min, root.val - pre);
      pre = root.val;
    }
    dfs(root.right);
  };
  dfs(root);
  return min;
};
```

### 二叉树的最近公共祖先

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。[二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/description/)

```js
var lowestCommonAncestor = function (root, p, q) {
  // 只存在两种情况
  //1.p 和 q在异侧，则一定存在一个公共祖先root，则left和right一定不为空
  //2.p 和 q在同侧，无论左右，则left和right其中一个一定为空
  const dfs = (root, p, q) => {
    if (!root || root === p || root === q) return root;
    const left = dfs(root.left, p, q);
    const right = dfs(root.right, p, q);
    if (left && right) {
      return root;
    }
    if (left) {
      return left;
    }
    if (right) {
      return right;
    }
  };
  return dfs(root, p, q);
};
```

### 翻转二叉树

```js
var invertTree = function (root) {
  if (!root) return null;
  const recursion = (root) => {
    if (!root) return;
    const temp = root.left;
    root.left = root.right;
    root.right = temp;
    recursion(root.left);
    recursion(root.right);
  };
  recursion(root);
  return root;
};
```

### 二叉树的前序遍历

先访问根节点，再遍历左子树，最后遍历右子树

```js
const front = (root) => {
  if (!root) return;
  console.log(root.val); //首先遍历根节点
  front(root.left); // 递归遍历左子树
  front(root.right); // 递归遍历右子树
};
```

```js
const front = (root) => {
  if (!root) return;
  const stack = [root];
  //利用栈先进后出的特性，先将根节点入栈
  while (stack.length) {
    const node = stack.pop();
    console.log(node.val);
    //先将右子树入栈
    if (node.right) {
      stack.push(node.right);
    }
    //再将左子树入栈
    if (node.left) {
      stack.push(node.left);
    }
  }
};
```

### 二叉树的中序遍历

先遍历左子树，再访问根节点，最后遍历右子树

```js
const mid = (root) => {
  if (!root) return;
  mid(root.left); // 递归遍历左子树
  console.log(root.val); // 打印根节点
  mid(root.right); // 递归遍历右子树
};
```

```js
const mid = (root) => {
  if (!root) return;
  const stack = [];
  let node = root;
  while (node || stack.length) {
    // 递归遍历左子树
    while (node) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop();
    console.log(node.val); // 打印根节点
    node = node.right; // 访问右子树
  }
};
```

### 二叉树的后序遍历

先遍历左子树，再遍历右子树，最后访问根节点

```js
const after = (root) => {
  if (!root) return;
  after(root.left); // 递归遍历左子树
  after(root.right); // 递归遍历右子树
  console.log(root.val); // 打印根节点
};
```

```js
const after2 = function (root) {
  if (!root) return;
  const arr = [root];
  const output = [];
  while (arr.length) {
    let ele = arr.pop();
    output.push(ele);
    // 先将左子树入栈
    if (ele.left) {
      arr.push(ele.left);
    }
    // 再将右子树入栈
    if (ele.right) {
      arr.push(ele.right);
    }
  }
  // 倒序输出
  while (output.length) {
    const ele = output.pop();
    console.log(ele.value);
  }
};
```

### 判断某数组是否是二叉查找树前序遍历结果

利用二叉查找树的特性：所有的左子节点的值都小于根节点的值，所有的右子节点的值都大于根节点的值。

```js
function isTrueTree(arr) {
  if (arr.length === 0) {
    return true;
  }
  let rootValue = arr[0];
  let leftTree = [];
  let rightTree = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < rootValue) {
      leftTree.push(arr[i]);
    } else {
      rightTree.push(arr[i]);
    }
  }
  return (
    isTrueTree(leftTree) &&
    isTrueTree(rightTree) &&
    rightTree.every((item) => item > rootValue)
  );
}
console.log(isTrueTree([8, 5, 17, 10, 12]));
console.log(isTrueTree([8, 5, 10, 1, 7, 12]));
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
  times.forEach((time) => {
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
  events.forEach((event) => {
    currentParking += event[1];
    maxParking = Math.max(maxParking, currentParking);
  });

  return maxParking;
}

const parkingTimes = [
  [0, 30],
  [5, 15],
  [20, 30],
  [0, 40],
  [0, 5],
  [5, 10],
];
console.log(minParkingSpaces(parkingTimes)); // 输出 4
```

## 滑动窗口

### 滑动窗口最大值

给定一个整数数组，有一个大小为 K 的滑动窗口，从数组的最左侧移动到最右侧，每次移动窗口都向右滑动一个位置。返回滑动窗口中的最大值。

1. 移除超出窗口范围的元素，即索引 i-k 的元素
2. 保持队列的单调性
3. 将当前元素添加到队列尾部
4. 如果窗口形成，即 i>=k-1,则将队列头部元素添加到结果数组中

```js
function maxSildingWindow(arr, k) {
  let res = [];
  let deque = []; // 双端队列，记录滑动窗口的索引
  // 移除队列中超过窗口范围的元素
  function removeOUtdated(index) {
    while (deque.length && deque[0] <= index - k) {
      deque.shift();
    }
  }
  //保持队列的单调性，当队列尾的元素小于当前元素，则弹出队列尾元素，直到队列尾元素大于当前元素
  function maintainDeque(index) {
    while (deque.length && arr[index] > arr[deque[deque.length - 1]]) {
      deque.pop();
    }
  }
  for (let i = 0; i < arr.length; i++) {
    removeOUtdated(i);
    maintainDeque(i);
    deque.push(i);
    //返回当前窗口最大值
    if (i >= k - 1) {
      res.push(arr[deque[0]]);
    }
  }
  return res;
}
console.log(maxSildingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // [3,3,5,5,6,7]
```

## 链表

### 环形链表||

给定一个链表的头节点 head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

1. 假设环外距离为 a，环长距离为 b，慢指针为 s，快指针为 f,则有：
2. f = 2s
3. f = s + nb
4. 两式相减：
5. s = nb, f= 2nb,即 fast 和 slow 指针分别走了 2n 和 n 个环长，此时相遇
6. 入口处的步数为 k = a + nb,即环外距离 + n 个环的周长,而此时 slow 指针走了 nb 步，所以需要再走 a 步才能到达入口处，恰好环外距离为 a，那么只要 s 在相遇点再走 a 步即可到达入口处

````js
var detectCycle = function (head) {
    let slow = head, fast = head
    while (fast) {
        slow = slow.next
        if (fast.next && fast.next.next) {
            fast = fast.next.next
        } else {
            return null
        }
        // 相遇直接退出循环
        if(fast === slow){
            break
        }
    }
    // 从相遇点开始，fast 和 slow 同时走a步，直到相遇，相遇点即为入口点
    fast = head
    while(fast !== slow) {
        fast = fast.next
        slow = slow.next
    }
    return fast
};
```

### 旋转链表

给你一个链表的头节点 head ，旋转链表，将链表每个节点向右移动 k 个位置。[旋转链表](https://leetcode.cn/problems/rotate-list/description/)

1. 注意到当向右移动的次数 k≥n 时，我们仅需要向右移动 k % n 次即可。因为每 n 次移动都会回到原位

```js
var rotateRight = function (head, k) {
  if (!head || !head.next) return head;
  let leftPre = null;
  let rightPre = null;
  let left = head,
    right = head,
    cur = head,
    length = 0,
    n = 0;
  // 计算链表长度
  while (cur) {
    cur = cur.next;
    length += 1;
  }
  // 计算需要向右移动的次数
  if (k >= length) {
    n = k % length;
  } else {
    n = k;
  }
  // 找到右移后的新头节点
  while (n !== 0) {
    right = right.next;
    n--;
  }
  // 如果左移后的新头节点和右移后的新头节点相同，则返回原头节点
  if (left === right) {
    return head;
  }
  // 找到左移后的新头节点
  while (right) {
    leftPre = left;
    left = left.next;
    rightPre = right;
    right = right.next;
  }
  // 将左移后的新头节点和右移后的新头节点连接起来
  leftPre.next = null;
  rightPre.next = head;
  // 返回左移后的新头节点
  return left;
};
````

### 两数相加 2

给你两个 非空 链表来代表两个非负整数。数字最高位位于链表开始位置。它们的每个节点只存储一位数字。将这两数相加会返回一个新的链表。[两数相加||](https://leetcode.cn/problems/add-two-numbers-ii/)

1. 思路 1，反转两个链表，然后相加，之后再反转回去

```ts
function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  let curA = l1,
    curB = l2,
    preA = null,
    preB = null;
  while (curA) {
    const next = curA.next;
    curA.next = preA;
    preA = curA;
    curA = next;
  }
  while (curB) {
    const next = curB.next;
    curB.next = preB;
    preB = curB;
    curB = next;
  }
  const newHead = new ListNode(-1);
  let l = newHead;
  let isUp = false;
  while (preA || preB) {
    let total;
    const num1 = preA ? preA.val : 0;
    const num2 = preB ? preB.val : 0;
    if (isUp) {
      total = num1 + num2 + 1;
    } else {
      total = num1 + num2;
    }
    if (total >= 10) {
      isUp = true;
      total = total % 10;
    } else {
      isUp = false;
    }
    l.next = new ListNode(total);
    l = l.next;
    preA = preA ? preA.next : null;
    preB = preB ? preB.next : null;
  }
  if (isUp) {
    l.next = new ListNode(1);
  }
  let curr = newHead.next,
    preCurr = null;
  while (curr) {
    const next = curr.next;
    curr.next = preCurr;
    preCurr = curr;
    curr = next;
  }
  return preCurr;
}
```

2. 思路 2，利用栈，也就是数组实现,本质上和思路 1 是一样的，只不过是利用数组实现栈，时间复杂度 O(N)，空间复杂度 O(N)

```ts
const arr1 = [];
const arr2 = [];
let curA = l1,
  curB = l2,
  preA = null,
  preB = null;
while (curA) {
  arr1.push(curA.val);
  curA = curA.next;
}
while (curB) {
  arr2.push(curB.val);
  curB = curB.next;
}
let left = 0;
arr1.reverse();
arr2.reverse();
let maxLen = Math.max(arr1.length, arr2.length);
const arr3 = [];
let isUp = false;
while (maxLen) {
  let total;
  const num1 = arr1[left] ? arr1[left] : 0;
  const num2 = arr2[left] ? arr2[left] : 0;
  if (isUp) {
    total = num1 + num2 + 1;
  } else {
    total = num1 + num2;
  }
  if (total >= 10) {
    isUp = true;
    total = total % 10;
  } else {
    isUp = false;
  }
  arr3.push(total);
  maxLen--;
  left++;
}
if (isUp) {
  arr3.push(1);
}
arr3.reverse();
const newHead = new ListNode(-1);
let l = newHead;
for (let i = 0; i < arr3.length; i++) {
  l.next = new ListNode(arr3[i]);
  l = l.next;
}
return newHead.next;
```

### 奇偶链表

给定单链表的头节点 head ，将所有索引为奇数的节点和索引为偶数的节点分别分组，保持它们原有的相对顺序，然后把偶数索引节点分组连接到奇数索引节点分组之后，返回重新排序的链表 [奇偶链表](https://leetcode.cn/problems/odd-even-linked-list/description/)

1. 思路，奇连奇，偶连偶，最后把奇偶拼接

```ts
function oddEvenList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  let pre = head,
    cur = head.next,
    l1 = head,
    l2 = head.next; // l1 奇数索引节点分组，l2 偶数索引节点分组
  while (cur) {
    const next = cur.next;
    pre.next = next;
    cur.next = next ? next.next : null;
    pre = next ? next : pre;
    cur = pre.next;
  }
  // 将偶数索引节点分组连接到奇数索引节点分组之后
  pre.next = l2;
  return l1;
}
```

### 相交链表

判断两个链表是否相交

1. 思路 1，先将一个链表放入哈希集合，然后遍历另一个链表判断节点即可

```ts
function getIntersectionNode(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  const map = new Map();
  let curA = headA;
  while (curA) {
    map.set(curA, curA);
    curA = curA.next;
  }
  let curB = headB;
  while (curB) {
    if (map.has(curB)) {
      return map.get(curB);
    }
    curB = curB.next;
  }
  return null;
}
```

2. 思路 2，利用双指针，一个指针遍历链表 A，一个指针遍历链表 B，如果 headA 与 headB 长度相等，则会遍历到同一节点，如果不等，则遍历到末尾后，再从另一个链表的头部开始遍历，直到遍历到同一节点，时间复杂度 O(M+N)，空间复杂度 O(1)

```ts
function getIntersectionNode(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  let l1 = headA,
    l2 = headB;
  while (l1 !== l2) {
    l1 = l1 ? l1.next : headB;
    l2 = l2 ? l2.next : headA;
  }
  return l1;
}
```

### 重排列表

给定一个单链表 L 的头节点 head ，单链表 L 表示为 L0 → L1 → … → Ln - 1 → Ln,请重新排列为 L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …

1. 思路 1，遍历链表，放入数组，利用数组下标进行重排列,时间复杂度 O(N)，空间复杂度 O(N)

```js
function reorderList(head) {
  if (!head || !head.next) return head;
  const arr = [];
  let cur = head;
  while (cur) {
    arr.push(cur);
  }
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    arr[left].next = arr[right];
    left++;
    if (left === right) {
      break;
    }
    arr[right].next = arr[left];
    right--;
  }
  arr[left].next = null;
}
```

2. 思路 2，利用快慢指针找到链表的中间节点，然后反转后半部分链表，最后将后半部分链表插入到前半部分链表中,时间复杂度 O(N)，空间复杂度 O(1)

```js
function reorderList(head) {
  let slow = head,
    fast = slow.next;
  // 快指针走两步，慢指针走一步，当快指针走完时，慢指针刚好走到中间
  while (fast) {
    slow = slow.next;
    fast = fast.next ? (fast.next.next ? fast.next.next : null) : null;
  }

  let pre = null;
  let cur = slow.next;
  slow.next = null;
  // 反转后半部分链表
  while (cur) {
    const next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  // 将后半部分链表插入到前半部分链表中
  let l1 = head,
    l2 = pre;
  while (l1 && l2) {
    const l1N = l1.next;
    const l2N = l2.next;
    l1.next = l2;
    l1 = l1N;
    l2.next = l1;
    l2 = l2N;
  }
}
```

### 反转链表

给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 。

1. 思路 1，通过数组来分隔链表，最后实现反转

```js
function reverseBetween(
  head: ListNode | null,
  left: number,
  right: number
): ListNode | null {
  const leftArr = [];
  const middleArr = [];
  const rightArr = [];
  let cur = head;
  let count = 1;
  while (cur) {
    if (count < left) {
      leftArr.push(cur);
    } else if (count > right) {
      rightArr.push(cur);
    } else {
      middleArr.push(cur);
    }
    count++;
    cur = cur.next;
  }
  // 这边还可以优化下,leftArr和rightArr里面的节点不需要再遍历，直接链接即可
  const mergeArr = [...leftArr, ...middleArr.reverse(), ...rightArr];
  for (let i = 0; i < mergeArr.length; i++) {
    mergeArr[i].next = mergeArr[i + 1] ? mergeArr[i + 1] : null;
  }
  return mergeArr[0];
}
```

2. 思路 2，头插法,即[1,2,3,4,5],反转[2,3,4]，那么只需要将 4 插入到 1 和 2 之间，3 插入到 2 和 4 之间,[1,2,3,4,5]=>[1,4,2,3,5]=>[1,4,3,2,5],需要首先找到前置节点，然后进行插入

```js
function reverseBetween(head, left, right) {
  if (!head || !head.next) return head;
  const newHead = new ListNode(-1);
  newHead.next = head;
  // g为前置节点，p为当前节点
  let g = newHead,
    p = g.next;
  for (let i = 0; i < left - 1; i++) {
    (g = g.next), (p = p.next);
  }
  for (let j = 0; j < right - left; j++) {
    const next = p.next;
    // 将当前节点链接到next的下一个节点
    p.next = next.next;
    // 将next节点链接到前置节点的下一个节点，即头插
    next.next = g.next;
    // 将前置节点链接到next节点
    g.next = next;
  }
  return newHead.next;
}
```

### 分隔链表

给你一个链表的头节点 head 和一个特定值 x ，请你对链表进行分隔，使得所有 小于 x 的节点都出现在 大于或等于 x 的节点之前。你应当 保留 两个分区中每个节点的初始相对位置。

1. 思路：通过遍历链表，使用两个数组来区分 cur 的大小，之后链接这两个数组进行遍历即可

```js
function partition(head, x) {
  if (!head || !head.next) return head;
  let arr1 = [];
  let arr2 = [];
  let cur = head;
  while (cur) {
    if (cur.val < x) {
      arr1.push(cur);
    } else {
      arr2.push(cur);
    }
    cur = cur.next;
  }
  const mergeArr = [...arr1, ...arr2];
  for (let i = 0; i < mergeArr.length; i++) {
    mergeArr[i].next = mergeArr[i + 1] ? mergeArr[i + 1] : null;
  }
  return mergeArr[0];
}
```

### 删除链表中的重复元素 1

1. 思路 1，新建链表，使用两个指针，一个指针指向当前节点，一个指针指向当前节点的下一个节点，但是和删除链表中重复元素 2 不同的是，这里需要保留重复的元素

```js
function deleteDuplicates(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  const newHead = new ListNode(-1);
  let l = newHead;
  let cur = head;
  let curNext = cur.next;
  while (cur && curNext) {
    if (cur.val !== curNext.val) {
      l.next = cur;
      l = l.next;
      cur = curNext;
      curNext = curNext.next;
    } else {
      cur = curNext;
      curNext = curNext.next;
    }
  }
  l.next = cur;
  return newHead.next;
}
```

### 删除链表中重复元素 2

给定一个已排序的链表的头 head ， 删除所有重复的元素

1. 思路 1，新建一个链表，遍历原链表，使用两个指针，一个指针指向当前节点，一个指针指向当前节点的下一个节点，如果当前节点的值与下一个节点的值相同，则跳过下一个节点，直到找到下一个节点的值与当前节点不同为止

````js
function deleteDuplicates(head) {
  if (!head || !head.next) return head
    const newHead = new ListNode(-1)
    let l = newHead
    let cur = head
    let curNext = cur.next
    let isNeedEscape = false
    while (cur && curNext) {
        if (cur.val !== curNext.val) {
            if (!isNeedEscape) {
                l.next = cur
                l = l.next
            }
            isNeedEscape = false
            cur = curNext
        } else {
            isNeedEscape = true
        }
        curNext = curNext.next
    }
    // 如果最后一个节点是重复的，则连接到下一个节点
    if (!curNext && !isNeedEscape) {
      // 最后一个节点是不重复的，则连接到当前节点
        l.next = cur
    } else {
      // 最后一个节点是重复的，则连接到null
        l.next = curNext
    }
    return newHead.next
}

### 两数相加
给定两个非空链表，表示两个非负整数。它们每位数字都是按照逆序的方式存储的，并且每个节点只能存储一位数字。请你将两个数相加，并以相同形式返回一个表示和的链表。你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
1. 思路1，模拟加法运算，从最低位开始，逐位相加，如果相加结果大于10，则进位，如果相加结果小于10，则不进位
```js
function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  let one = l1;
  let two = l2;
  // 头节点
  let three = new ListNode(-1);
  // 当前节点
  let cur = three;
  // 是否进位
  let isOver = false;
  // 遍历两个链表，直到两个链表都遍历完
  while (one || two) {
    // 获取两个链表当前节点的值
    const num1 = one ? one.val : 0;
    const num2 = two ? two.val : 0;
    // 计算两个节点的值相加
    let total;
    // 如果进位，则相加结果加1
    isOver ? (total = num1 + num2 + 1) : (total = num1 + num2);
    isOver = total >= 10 ? true : false;
    const num = total % 10;
    const next = new ListNode(num);
    cur.next = next;
    cur = cur.next;
    one = one ? one.next : null;
    two = two ? two.next : null;
  }
  // 如果最后还有进位，则添加一个新节点
  if (isOver) { // [!code ++]
    cur.next = new ListNode(1);
  }
  return three.next;
}
````

### 合并两个有序链表

```js
使用递归，复杂度O(M+N) // [!code ++]
const mergerTwoLists = (l1, l2) => {
  if (!l1) {
    return l2;
  }
  if (!l2) {
    return l1;
  }
  if(l1.val < l2.val){
    l1.next = mergerTwoLists(l1.next, l2)
    return l1
  }else {
    l2.next = mergerTwoLists(l1, l2.next)
    return l2
  }
}
```

```js
// 迭代 // [!code ++]
const mergerTwoLists = (l1, l2) => {
  const prehead = new ListNode(-1);
  let prev = prehead;
  while (l1 && l2) {
    if (l1.val < l2.val) {
      prev.next = l1;
      l1 = l1.next;
    } else {
      prev.next = l2;
      l2 = l2.next;
    }
    prev = prev.next;
  }
  return prehead.next;
};
```

## 回溯

### 衣橱整理

给你一个 m \* n 的矩阵，要求在保持连续不断地访问所有格子，并且数位和不能大于 cnt，

1. 需要使用一个 visited 数组记录访问过的格子，以免重复访问(0,0) → (0,1) → (1,1),(0,0) → (1,0) → (1,1)
2. 在回溯的时候不能使用 j += 1,应该使用 j + 1,因为使用 j += 1 传递的 j 值永久改变了，后续回溯的时候会导致错误计算

```js
var wardrobeFinishing = function (m, n, cnt) {
  let count = 0;
  const visited = Array(m)
    .fill(0)
    .map(() => Array(n).fill(false));
  const backtrack = (i, j) => {
    if (i > m - 1 || j > n - 1 || i < 0 || j < 0 || visited[i][j]) {
      return;
    }
    const a = Math.floor(i / 10) + (i % 10);
    const b = Math.floor(j / 10) + (j % 10);
    if (a + b > cnt) {
      visited[i][j] = true;
      return;
    } else {
      visited[i][j] = true;
      count += 1;
    }
    // 尝试向右移动
    backtrack(i, j + 1);
    // 尝试向下移动
    backtrack(i + 1, j);
  };
  backtrack(0, 0);
  return count;
};
```

### 累加数

一个有效的 累加序列 必须 至少 包含 3 个数。除了最开始的两个数以外，序列中的每个后续数字必须是它之前两个数字之和。[累加数](https://leetcode.cn/problems/additive-number/description/)

1. 使用递归实现回溯算法，递归函数 match，参数 l、m、r 分别表示待匹配的 3 个数的起始位置
2. match 函数第一步先处理边界情况、0 开头的特殊情况
3. 第二步从 num 字符串中取出前两个数并求和，得到第三个数 n3
4. 第三步剪枝，如果剩余字符比要查找的结果更短，直接返回 false
5. 第四步在剩余字符串中查找 n3 是否存在，若存在且正好用尽所有字符则返回 true
6. 若不存在则尝试 r 右移一位以及 m 右移一位的情况

```js
var isAdditiveNumber = function (num) {
  function match(l, m, r) {
    // 处理边界情况
    debugger;
    if (r > num.length || m > num.length - 1 || l >= m || m >= r) return false;

    // 处理前导0：如果第一个数字以0开头且长度>1，无效
    if (num[l] === "0" && m - l > 1) return false;
    // 处理前导0：如果第二个数字以0开头且长度>1，无效
    if (num[m] === "0" && r - m > 1) return false;

    const n3 = `${+num.slice(l, m) + +num.slice(m, r)}`;

    // 剪枝：如果剩余字符比要查找的结果更短，直接返回false
    if (n3.length > num.length - r) return false;

    // 检查第三个数字是否匹配
    if (num.slice(r, r + n3.length) === n3) {
      // 如果到达末尾，返回true
      if (r + n3.length === num.length) return true;
      // 否则继续递归，注意：递归时第一个数字应该是当前第二个数字的位置m
      // 第三个数字的结束位置是 r + n3.length，作为新的第二个数字的结束位置
      if (match(m, r, r + n3.length)) return true;
    }

    return false;
  }

  // 尝试所有可能的前两个数字的组合
  for (let i = 1; i < num.length; i++) {
    for (let j = i + 1; j < num.length; j++) {
      if (match(0, i, j)) return true;
    }
  }

  return false;
};
```

### 复原 Ip 地址

1. 切割思想，使用一个 startIndex 切割字符串
2. 分隔为 4 段，并且最后一段也要符合 ip 地址的规则
3. 在每次回溯中判断 ip 地址是否有效

```js
var restoreIpAddresses = function (s) {
  const result = [];
  const len = s.length + 3;
  const backtrack = (s, startIndex, path) => {
    // 如果分隔为4段，并且最后一段也符合ip地址的规则，则将结果push到result中
    // 使用startIndex来判断是否已经遍历完字符串
    if (path.length === 4 && startIndex >= s.length) {
      result.push(path.join("."));
      return;
    }
    // 如果分隔为4段，或者已经遍历完字符串，但是没有进行前置push，则返回
    if (path.length === 4 || startIndex >= s.length) return;
    // 枚举每个可能的切割位置
    for (let i = startIndex + 1; i <= s.length; i++) {
      // 切割字符串
      const str = s.slice(startIndex, i);
      // 判断切割后的字符串是否符合ip地址的规则
      if (isIp(str)) {
        // 如果符合ip地址的规则，则将切割后的字符串push到path中，并递归调用backtrack
        path.push(str);
        backtrack(s, i, path);
        path.pop();
        // 回溯，将切割后的字符串从path中pop出来
      }
    }
  };
  const isIp = (str) => {
    let temp = Number(str);
    if (
      str.length === 0 ||
      isNaN(temp) ||
      temp > 255 ||
      temp < 0 ||
      (str.length > 1 && str[0] === "0")
    ) {
      return false;
    }
    return true;
  };
  backtrack(s, 0, []);
  return result;
};
```

### 单词搜索

给定一个 m x n 的矩阵 board 和一个字符串 word ，判断 word 是否存在于 board 中。
字符串由字母和数字组成。[单词搜索](https://leetcode.cn/problems/word-search/description/)

1. 枚举 i=0,1,2,…,m−1 和 j=0,1,2,…,n−1，以 (i,j) 为起点开始搜索
2. 同时，我们还需要知道当前匹配到了 word 的第几个字母，所以还需要一个参数 k
3. 定义 dfs(i,j,k) 表示当前在 board[i][j] 这个格子，要匹配 word[k]，返回在这个状态下最终能否匹配成功（搜索成功）
4. board[i][j] !=word[k]，匹配失败，返回 false
5. 如果 k=len(word)−1，匹配成功，返回 true
6. 枚举 (i,j) 周围的四个相邻格子 (x,y)，如果 (x,y) 没有出界，则递归 dfs(x,y,k+1)，如果其返回 true，则 dfs(i,j,k) 也返回 true。
7. 如果递归周围的四个相邻格子都没有返回 true，则最后返回 false，表示没有搜到
8. 为了避免重复访问同一个格子,直接修改 board[i][j]，将其置为空（或者 0），返回 false 前再恢复成原来的值（恢复现场）
9. 优化一，如果 word 的某个字母的出现次数，比 board 中的这个字母的出现次数还要多，可以直接返回 false
10. 如果 word=abcd 但 board 中的 a 很多，d 很少（比如只有一个），那么从 d 开始搜索，能更快地找到答案。

```js
var exist = function (board, word) {
  const m = board.length,
    n = board[0].length,
    len = word.length;
  const map = new Map();
  for (const row of board) {
    for (const item of row) {
      map.set(item, (map.get(item) ?? 0) + 1);
    }
  }
  const map1 = new Map();
  for (const c of word) {
    map1.set(c, (map1.get(c) ?? 0) + 1);
    // 优化一，如果 word 的某个字母的出现次数，比 board 中的这个字母的出现次数还要多，可以直接返回 false
    if (map1.get(c) > (map.get(c) ?? 0)) {
      return false;
    }
  }
  // 优化二，如果 word 的最后一个字母的出现次数，比 board 中的这个字母的出现次数还要多，则将 word 反转
  if ((map.get(word[word.length - 1]) ?? 0) < (map.get(word[0]) ?? 0)) {
    word = word.split("").reverse();
  }

  const backtrack = (i, j, k) => {
    // 如果当前格子的字母不等于 word 的第 k 个字母，则匹配失败，返回 false
    if (board[i][j] !== word[k]) {
      return false;
    }
    // 找到了
    if (k + 1 === len) {
      return true;
    }
    // 避免重复访问
    board[i][j] = 0;
    // 枚举该格子的四个相邻格子
    for (const [x, y] of [
      [i, j - 1],
      [i, j + 1],
      [i - 1, j],
      [i + 1, j],
    ]) {
      // 边界判断 并且递归判断后续是否能找到匹配方案
      if (0 <= x && x < m && 0 <= y && y < n && backtrack(x, y, k + 1)) {
        return true;
      }
    }
    // 恢复现场
    board[i][j] = word[k];
    return false;
  };
  // 开始枚举网格
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 如果从 (i,j) 出发能找到匹配方案，则返回 true
      if (backtrack(i, j, 0)) {
        return true;
      }
    }
  }
  return false;
};
```

### 组合

给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合。[组合](https://leetcode.cn/problems/combinations/description/)

```js
var combine = function (n, k) {
  const result = [];
  const nums = [];
  for (let i = 1; i <= n; i++) {
    nums.push(i);
  }
  const backtrack = (path, nums) => {
    if (path.length === k) {
      result.push(path);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      const curPath = [...path, nums[i]];
      const newNums = nums.slice(i + 1);
      backtrack(curPath, newNums);
    }
  };
  backtrack([], nums);
  return result;
};
```

### 组合总和||

给定一个候选人编号的集合 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合。
candidates 中的每个数字在每个组合中只能使用 一次 。[组合总和||](https://leetcode.cn/problems/combination-sum-ii/description/)

```js
var combinationSum2 = function (candidates, target) {
  const result = [];
  candidates.sort((a, b) => a - b);
  const recursion = (path, nums, sum, target) => {
    if (sum === target) {
      result.push(path);
      return;
    } else if (sum > target) {
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === nums[i - 1]) {
        continue;
      }
      const num = nums[i];
      const curArr = [...path, num];
      const newSum = sum + num;
      const newNums = nums.slice(i + 1);
      recursion(curArr, newNums, newSum, target);
    }
  };
  recursion([], candidates, 0, target);
  return result;
};
```

### 组合总和

1. 思路![组合总和](/public//39.png)

```js
var combinationSum = function (candidates, target) {
  const result = [];
  const recursion = (path, nums, sum, target) => {
    if (sum === target) {
      result.push(path);
      return;
    } else if (sum > target) {
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      const curPath = [...path, nums[i]];
      const newSum = sum + num;
      const newNums = nums.slice(i);
      recursion(curPath, newNums, newSum, target);
    }
  };
  recursion([], candidates, 0, target);
  return result;
};
```

### 括号生成

1. 思路 1，通过选与不选，如果左括号的数量小于 n，那么可以填入左括号，如果现在右括号个数等于左括号个数，那么不能填右括号。如果现在右括号个数小于左括号个数，那么可以填右括号，由于右括号个数始终 ≥ 左括号个数，所以当我们填了 n 个右括号时，也一定填了 n 个左括号，此时填完所有 2n 个括号

```js
var generateParenthesis = function (n) {
  const result = [];
  const arr = [];
  const recursion = (left, right) => {
    // 当right===n时，说明填完
    if (right === n) {
      result.push(arr.join(""));
      return;
    }
    if (left < n) {
      arr[left + right] = "(";
      recursion(left + 1, right);
    }
    if (right < left) {
      arr[right + left] = ")";
      recursion(left, right + 1);
    }
  };

  recursion(0, 0);
  return result;
};
```

### 电话号码的字母组合

给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。[电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/description/)

```js
var letterCombinations = function (digits) {
  const mapArr = [
    [],
    [],
    ["a", "b", "c"],
    ["d", "e", "f"],
    ["g", "h", "i"],
    ["j", "k", "l"],
    ["m", "n", "o"],
    ["p", "q", "r", "s"],
    ["t", "u", "v"],
    ["w", "x", "y", "z"],
  ];
  const arr = digits.split("");
  const strArr = [];
  for (let i = 0; i < arr.length; i++) {
    strArr.push(mapArr[arr[i]]);
  }
  const result = [];
  const len = strArr.length;
  const recursion = (curArr, nums) => {
    if (curArr.length === len) {
      result.push(curArr);
      return;
    }
    // 每次循环第一个字母键次数
    for (let i = 0; i < nums[0].length; i++) {
      // 拿到每个字母
      const arr = [...curArr, nums[0][i]];
      // 过滤掉当前的字母组合，传递后续字母组合，此处不能使用传统的filter过滤，因为是双层数组
      const lestArr = nums.slice(1);
      recursion(arr, lestArr);
    }
  };
  recursion([], strArr);
  const res = [];
  for (const item of result) {
    res.push(item.join(""));
  }
  return res;
};
```

### 全排列

```js
function permute(nums) {
  const result = [];

  const backtrack = (current, remaining) => {
    // 如果没有剩余元素，说明当前排列已完成
    if (remaining.length === 0) {
      result.push(current);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      // 选择第 i 个元素
      const nextCurrent = [...current, remaining[i]];
      // 递归选择剩余元素
      const nextRemaining = remaining.filter((_, index) => index !== i);
      backtrack(nextCurrent, nextRemaining);
    }
  };

  backtrack([], nums);
  return result;
}
const array = [1, 2, 3, 4];
const permutations = permute(array);
console.log(permutations);
```

## DP

### 买卖股票

给定一个整数数组，第 i 个元素代表第 i 天的股票价格，fee 为交易手续费，求最大利润。

```js
function findMaxProfit(prices, fee) {
  if (prices.length <= 1) {
    return 0;
  }
  let maxProfit = 0; // 最大利润
  let holdProfit = -prices[0]; // 持有股票的最大利润
  for (let i = 1; i < prices.length; i++) {
    maxProfit = Math.max(maxProfit, holdProfit + prices[i] - fee); // 计算卖出股票的最大利润
    holdProfit = Math.max(holdProfit, maxProfit - prices[i]); // 计算持有股票的最大利润
  }
  return maxProfit;
}
console.log(findMaxProfit([1, 3, 2, 8, 4, 9], 2)); // 8
```

## 递归

### 设计一个机械累加器

请设计一个机械累加器，计算从 1、2... 一直累加到目标数值 target 的总和。注意这是一个只能进行加法操作的程序，不具备乘除、if-else、switch-case、for 循环、while 循环，及条件判断语句等高级功能。[设计一个机械累加器](https://leetcode.cn/problems/qiu-12n-lcof/description/)

1. 思路 1，递归，通过递归调用自身，每次将 target 减 1，直到 target 为 0 为止

```js
var mechanicalAccumulator = function (target) {
  // 注意此处不能使用target--，--是后置运算符，会不断循环导致栈溢出
  target && (target += mechanicalAccumulator(target - 1));
  return target;
};
```

### 对称二叉树

请设计一个函数判断一棵二叉树是否 轴对称 。[对称二叉树](https://leetcode.cn/problems/dui-cheng-de-er-cha-shu-lcof/description/)

1. 思路 1，递归，从根节点开始，递归判断左子树和右子树是否对称，通过「同步移动」两个指针的方法来遍历这棵树，p 指针和 q 指针一开始都指向这棵树的根，随后 p 右移时，q 左移，p 左移时，q 右移。每次检查当前 p 和 q 节点的值是否相等

```js
var checkSymmetricTree = function (root) {
  if (!root) return true;
  const recursion = (p, q) => {
    if (!p && !q) return true;
    if ((!p && q) || (p && !q)) return false;
    if (p.val !== q.val) return false;
    return recursion(p.left, q.right) && recursion(p.right, q.left);
  };

  return recursion(root.left, root.right);
};
```

### 子结构判断

给定两棵二叉树 tree1 和 tree2，判断 tree2 是否以 tree1 的某个节点为根的子树具有 相同的结构和节点值 。注意，空树 不会是以 tree1 的某个节点为根的子树具有 相同的结构和节点值 。[子结构判断](https://leetcode.cn/problems/shu-de-zi-jie-gou-lcof/description/)

```js
var isSubStructure = function (A, B) {
  // 空树不是任意一个树的子结构
  if (!A || !B) {
    return false;
  }
  return (
    // 判断B是否A的子树，否则，递归判断B是否是A的左子树和右子树中的一部分
    recursion(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B)
  );
};
const recursion = (A, B) => {
  // B可以为空
  if (!B) {
    return true;
  }
  // 子有父不能为空
  // 如果B不为空，但A为空
  if (!A) {
    return false;
  }
  if (A.val !== B.val) {
    return false;
  }
  // 递归判断左子树和右子树
  return recursion(A.left, B.left) && recursion(A.right, B.right);
};
```

### 平衡二叉树

给定一个二叉树，判断它是否是 平衡二叉树[平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/description/)

1. 思路 1，递归，从根节点开始，递归遍历左子树和右子树，如果左子树和右子树的高度差大于 1，则返回 false，否则返回 true

```js
var isBalanced = function (root) {
  if (!root) return true;
  let result = true;
  const recursion = (root) => {
    if (!root) return 1;
    const leftLen = recursion(root.left) + 1;
    const rightLen = recursion(root.right) + 1;
    if (Math.abs(leftLen - rightLen) >= 2) {
      result = false;
    }
    return Math.max(leftLen, rightLen);
  };
  recursion(root);
  return result;
};
```

```js
var isBalanced = function (root) {
  if (!root) return true;
  const recursion = (root) => {
    if (!root) return 0;
    const leftLen = recursion(root.left);
    const rightLen = recursion(root.right);
    if (leftLen === -1 || rightLen === -1 || Math.abs(leftLen - rightLen) > 1) {
      return -1;
    }
    return Math.max(leftLen, rightLen) + 1;
  };
  return recursion(root) !== -1;
};
```

### 二叉树最大深度

```js
var maxDepth = function (root) {
  if (!root) return 0;
  const recursion = (root) => {
    if (!root) return 0;
    return Math.max(recursion(root.left) + 1, recursion(root.right) + 1);
  };
  const len = recursion(root);
  return len;
};
```

### 验证搜索二叉树

给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。[验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/description/)

```js
var isValidBST = function (root) {
  const rootVal = root.val;
  const recursion = (root, lower, higher) => {
    if (!root) return true;

    if (root.val <= lower || root.val >= higher) {
      return false;
    }
    return (
      recursion(root.left, lower, root.val) &&
      recursion(root.right, root.val, higher)
    );
  };
  return recursion(root, -Infinity, Infinity);
};
```
