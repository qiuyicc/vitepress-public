# Windows

## 安装Choco

1. 管理员身份打开CMD窗口
2. 输入以下命令：
```js
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```
3. 等待安装完成，然后输入命令查看是否安州成功
```js
choco -v
// C:\Users\Qiuyi>choco -v
// 2.3.0
```