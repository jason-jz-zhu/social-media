# Claude Code Remote Control 完整配置指南

## 一、前提条件

你需要准备以下东西：

1. **Claude 订阅账号**：必须是 Pro ($20/月) 或 Max ($100/$200/月) 计划。API key 不行，免费账号也不行。
2. **操作系统**：macOS 13.0+、Ubuntu 20.04+、或 Windows 10 (需要 WSL)
3. **内存**：至少 4GB RAM（推荐 8GB）
4. **网络**：电脑和手机都需要联网（不需要同一个 WiFi）
5. **手机端**：Claude iOS/Android App，或者任意浏览器

注意：使用原生安装方式时，**不需要**提前安装 Node.js 或 npm。

---

## 二、安装 Claude Code

### 方法一：原生安装（推荐，零依赖）

打开终端，输入：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

这是官方推荐方式，不需要 Node.js，会自动后台更新。

### 方法二：Homebrew 安装（macOS）

```bash
brew install --cask claude-code
```

注意：Homebrew 安装不会自动更新，需要手动 `brew upgrade claude-code`。

### 方法三：npm 安装（已不推荐）

```bash
npm install -g @anthropic-ai/claude-code
```

需要 Node.js 18+ 环境。**千万不要用 sudo**，如果遇到权限问题，请用 nvm 管理 Node.js。

### 验证安装

```bash
claude --version
```

能看到版本号就说明安装成功。Remote Control 需要 **2.1.52 或更高版本**。

---

## 三、首次登录

安装完成后，第一次需要登录：

```bash
claude
```

进入交互界面后，输入：

```
/login
```

会跳转到浏览器让你用 claude.ai 账号登录授权。登录完成后回到终端。

然后在你的项目目录下运行一次 `claude`，接受信任对话框（trust dialog）。

---

## 四、启动 Remote Control（核心步骤）

### 方式一：在已有会话中启动

如果你已经在 Claude Code 会话中：

```
/remote-control
```

或者简写：

```
/rc
```

### 方式二：直接从命令行启动

```bash
claude remote-control
```

### 启动后会发生什么？

1. 终端会显示一个 **会话链接**（session URL）
2. 按 **空格键** 可以切换显示 **QR 码**
3. 你可以用手机扫码，或者复制链接在浏览器打开

---

## 五、手机端连接

你有三种方式连接：

### 方式一：扫 QR 码（最快）
- 在终端按空格键显示 QR 码
- 用手机相机扫码
- 会自动跳转到 Claude App 或浏览器

### 方式二：浏览器打开链接
- 复制终端显示的 session URL
- 在手机浏览器中打开 `claude.ai/code`
- 在会话列表中找到你的会话

### 方式三：Claude App
- 打开 Claude iOS 或 Android App
- 进入 `claude.ai/code` 页面
- 你的 Remote Control 会话会出现在列表中

连接成功后，你在手机上输入的指令会在电脑上执行，结果实时同步到手机。

---

## 六、设置永久开启 Remote Control

如果你希望每次启动 Claude Code 都自动开启 Remote Control：

在 Claude Code 会话中输入：

```
/config
```

找到 `Enable Remote Control for all sessions`，设为 `true`。

---

## 七、Bypass Permissions 模式（自主运行）

如果你想让 Claude Code 自动执行所有操作、不用一直点"同意"：

```bash
claude --dangerously-skip-permissions
```

这等同于 `--permission-mode bypassPermissions`。

### 注意事项：
- 它会**跳过所有权限确认**，自动执行文件读写、命令运行等
- `.git`、`.claude`、`.vscode`、`.idea` 目录的写入仍然会要求确认
- **强烈建议**只在容器/虚拟机等隔离环境中使用
- 32% 的使用者遇到过意外文件修改，9% 报告过数据丢失
- 适合 CI/CD 管道等无法人工交互的场景

配合 Remote Control 使用的典型命令：

```bash
claude --dangerously-skip-permissions
```

然后在会话中输入 `/rc`，手机上就可以只看进度、不用管权限弹窗了。

---

## 八、常见问题排查

### 问题 1：看不到 QR 码
- 按**空格键**切换 QR 码显示
- 如果还是没有，直接复制 session URL 在浏览器打开

### 问题 2：扫码后无法连接 / 页面加载失败
- 确认电脑和手机用的是**同一个 Claude 账号**
- 在两端都退出重新登录
- 确保网络连接正常
- 重启 Claude Code 重新生成会话

### 问题 3：提示 "Remote Control is not available for your account"
- 确认你的订阅是 Pro 或 Max 计划
- 确认 Claude Code 版本 >= 2.1.52（运行 `claude --version` 检查）
- 如果刚升级订阅，等几分钟再试

### 问题 4：手机端显示 "failed to load"
- 刷新页面重试
- 在 Claude App 的会话列表中手动找到会话
- 尝试用浏览器打开 `claude.ai/code` 代替 App

### 问题 5：连接中断
- 电脑必须保持开机且终端会话不能关闭
- 如果电脑休眠或终端被关，连接就断了
- 重新在电脑上启动 `/rc` 即可

---

## 九、使用技巧

1. **Plan Mode 先规划再执行**：手机上告诉它 "先规划不要执行"，看完方案满意了再说 "执行"
2. **多项目并行**：在电脑上开多个终端窗口，每个进不同项目目录，分别启动 `/rc`，手机上可以在多个会话间切换
3. **出门前给大任务**：配合 bypass permissions，给一个大任务然后出门，回来检查结果
4. **保持电脑不休眠**：macOS 可以用 `caffeinate` 命令防止休眠：
   ```bash
   caffeinate -s &
   ```

---

## 十、完整流程总结（从零开始）

```bash
# 1. 安装 Claude Code
curl -fsSL https://claude.ai/install.sh | bash

# 2. 进入项目目录
cd ~/my-project

# 3. 启动并登录
claude
# 在会话中输入 /login，完成浏览器授权

# 4. 启动 Remote Control
# 在会话中输入：
/rc
# 按空格键显示 QR 码

# 5. 手机扫码连接，开始远程写代码
```

整个过程 2 分钟内完成。
