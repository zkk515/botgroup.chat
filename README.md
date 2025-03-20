# AI 多人聊天室

一个基于 React和 Cloudflare Pages(免费一键部署) 的多人 AI 聊天应用，支持多个 AI 角色同时参与对话，提供类似群聊的交互体验。体验地址：[https://botgroup.chat](https://botgroup.chat)

## 功能特点

- 🤖 支持多个 AI 角色同时对话
- 💬 实时流式响应
- 🎭 可自定义 AI 角色和个性
- 👥 群组管理功能
- 🔇 AI 角色禁言功能
- 📝 支持 Markdown 格式
- ➗ 支持数学公式显示（KaTeX）
- 🎨 美观的 UI 界面
- 📱 响应式设计，支持移动端

## 演示截图

![新闻观点互补](https://i.v2ex.co/2Sf2Uc3s.png)
![文字游戏](https://i.v2ex.co/tu4a5mv9.png)
![成语接龙](https://i.v2ex.co/F847yqQR.png)

## 一键部署到cloudflare

1. [Fork本项目](https://github.com/maojindao55/botgroup.chat/fork)到你的 GitHub 账号

2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入  Workers & Pages 页面
   - 点击 "Create a application > Pages" 按钮
   - 选择 "Connect to Git"

3. 配置部署选项
   - 选择你 fork 的仓库
   - 设置以下构建配置：
     - Framework preset: None
     - Build command: `npm run build`
     - Build output directory: `dist`
     - 设置环境变量（必须）：
       ```
        DASHSCOPE_API_KEY=xxx //千问模型KEY
        HUNYUAN_API_KEY=xxx //混元模型KEY
        ARK_API_KEY=xxx //豆包模型KEY
       ```

4. 点击 "Save and Deploy"
   - Cloudflare Pages 会自动构建和部署你的应用
   - 完成后可通过分配的域名访问应用

注意：首次部署后，后续的代码更新会自动触发重新部署。


## 自定义（可选）

1. 配置 模型和AI 角色

   - 在 `config/aiCharacters.ts` 中

        自定义模型

        ```typescript
        {
            model: string;     // 模型标识, 请按照服务方实际模型名称配置(注意：豆包的配置需要填写火山引擎接入点)，比如qwen-plus,deepseek-v3,hunyuan-standard
            apiKey: string;    // 模型的 API 密钥
            baseURL: string;    // 模型的 baseURL
        }
        ```
        
        配置 AI 角色信息
        ```typescript
        id: string;        // 角色唯一标识
        name: string;      // 角色显示名称
        personality: string; // 角色性格描述
        model: string;     // 使用的模型，要从modelConfigs中选择
        avatar?: string;   // 可选的头像 URL
        custom_prompt?: string;  // 可选的自定义提示词
        ```
   
         示例配置：
         ```typescript
         {
         id: "assistant1",
         name: "小助手",
         personality: "友善、乐于助人的AI助手",
         model: "qwen",//注意豆包的配置需要填写火山引擎的接入点
         avatar: "/avatars/assistant.png",
         custom_prompt: "你是一个热心的助手，擅长解答各类问题。"
         }
         ```
2. 配置群组
   - 在 `config/groups.ts` 中配置群组信息
        ```typescript
        id: string;        // 群组唯一标识
        name: string;      // 群组名称
        description: string; // 群组描述
        members: string[]; // 群组成员ID数组
        ```
   
   示例配置：
   ```typescript
   {
     id: "group1",
     name: "AI交流群",
     description: "AI角色们的日常交流群",
     members: ["ai1", "ai2", "ai3"] // 成员ID需要与 aiCharacters.ts 中的id对应
   }
   ```

   注意事项：
   - members 数组中的成员 ID 必须在 `aiCharacters.ts` 中已定义
   - 每个群组必须至少包含两个成员
   - 群组 ID 在系统中必须唯一

## 本地环境启动/调试
由于本项目后端server使用的是Cloudflare-Pages-Function（本质是worker）

1. 所以本地部署需要 [安装 wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/):

   ``
   npm install wrangler --save-dev
   ``

2. 使用本项目启动脚本启动 

   `sh devrun.sh` 本地默认预览地址是：http://127.0.0.1:8788




## 贡献指南

欢迎提交 Pull Request 或提出 Issue。
当然也可以加共建QQ群交流：922322461（群号）

## 跪谢赞助商ORZ
此项目开源上线以来，用户猛增tokens消耗每日近千万，因此接受了国内多个基座模型厂商给予的tokens的赞助，作为开发者由衷地感谢国产AI模型服务商雪中送炭，雨中送伞！

## Tokens 赞助情况

|品牌logo  | AI服务商 | 赞助Tokens 额度 |新客注册apikey活动|
|---------|----------|------------|-------|
|![智谱AI](data:image/png;base64,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)| 智谱AI | 5.5亿 | [新用户免费赠送专享 2000万 tokens体验包！ ](https://zhipuaishengchan.datasink.sensorsdata.cn/t/9z)|
|![火山引擎](https://portal.volccdn.com/obj/volcfe/logo/appbar_logo_dark.2.svg)| 字节跳动火山引擎 | 5亿 | 1. [火山引擎大模型新客使用豆包大模型及 DeepSeek R1模型各可享 10 亿 tokens/模型的5折优惠 ，5个模型总计 50 亿 tokens](https://console.volcengine.com/ark/region:ark+cn-beijing/openManagement?LLM=%7B%7D&OpenTokenDrawer=false&projectName=default) <br> <br> 2. [应用实验室助力企业快速构建大模型应用，开源易集成，访问Github获取应用源代码](https://github.com/volcengine/ai-app-lab/tree/main)|
|![腾讯云](https://cloudcache.tencent-cloud.com/qcloud/portal/kit/images/slice/logo.23996906.svg)| 腾讯混元AI模型 | 1亿 |[新户注册免费200万tokens额度](https://cloud.tencent.com/product/hunyuan)|
|![monica](https://files.monica.cn/assets/botgroup/monica.png)| Monica团队 | 其他未认领模型所有tokens |[用monica中文版免费和 DeepSeek V3 & R1 对话](https://monica.cn/)|


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=maojindao55/botgroup.chat&type=Date)](https://star-history.com/#maojindao55/botgroup.chat&Date)

## 许可证

[MIT License](LICENSE)
